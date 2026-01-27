// import { useState, useEffect, ChangeEvent } from "react";
// import VideoProcessorWorker from "../workers/videoProcessor.worker.ts?worker";
// import { ClientData } from "../services/ocrSrvice";

// export default function VideoUpload() {
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [fps, setFps] = useState<number>(1);
//   const [processing, setProcessing] = useState(false);
//   const [clients, setClients] = useState<ClientData[]>([]);
//   const [format, setFormat] = useState<"txt" | "excel" | "both">("txt");
//   const [worker, setWorker] = useState<Worker | null>(null);

//   // Crear worker al montar
//   useEffect(() => {
//     const w = new VideoProcessorWorker();
//     setWorker(w);

//     w.onmessage = (event: MessageEvent<{ clients: ClientData[] }>) => {
//       setClients(event.data.clients);
//       setProcessing(false);
//       alert("Proceso completado!");
//     };

//     return () => w.terminate();
//   }, []);

//   const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !file.type.startsWith("video/")) {
//       alert("Por favor selecciona un archivo de video válido.");
//       return;
//     }
//     setVideoFile(file);
//     setClients([]);
//   };

//   const handleProcess = async () => {
//     if (!videoFile || !worker) return;

//     setProcessing(true);

//     // Crear video y canvas
//     const video = document.createElement("video");
//     video.src = URL.createObjectURL(videoFile);
//     await new Promise<void>((resolve) => {
//       video.onloadedmetadata = () => resolve();
//     });

//     const canvas = document.createElement("canvas");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext("2d")!;
//     const frames: Blob[] = [];

//     // Capturar frames
//     for (let t = 0; t < video.duration; t += 1 / fps) {
//       video.currentTime = t;
//       await new Promise<void>((resolve) => {
//         video.onseeked = () => setTimeout(resolve, 50); // espera 50ms para render
//       });
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       const blob = await new Promise<Blob | null>((resolve) =>
//         canvas.toBlob(resolve, "image/png")
//       );
//       if (blob) frames.push(blob);
//     }

//     // Enviar frames al worker
//     worker.postMessage({ frames });
//   };

//   const downloadClients = () => {
//     if (format === "txt" || format === "both") {
//       // TXT
//       const content = clients
//         .map(
//           (c) =>
//             `Número: ${c.numero}\nNombre: ${c.nombre}\nDirección: ${c.direccion}\nCódigo Postal: ${c.codigoPostal}`
//         )
//         .join("\n\n");
//       const blob = new Blob([content], { type: "text/plain" });
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = "clientes.txt";
//       a.click();
//       a.remove();
//     }

//     // if (format === "excel" || format === "both") {
//     //   // Excel (xlsx)
//     //   import("xlsx").then((XLSX) => {
//     //     const ws = XLSX.utils.json_to_sheet(clients);
//     //     const wb = XLSX.utils.book_new();
//     //     XLSX.utils.book_append_sheet(wb, ws, "Clientes");
//     //     XLSX.writeFile(wb, "clientes.xlsx");
//     //   });
//     // }
//   };

//   return (
//     <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
//       <h1>¡Hola! 👋 Bienvenido al extractor de clientes</h1>

//       <p>Selecciona un video donde se muestren los datos de los clientes:</p>
//       <input type="file" accept="video/*" onChange={handleUpload} />

//       <div style={{ marginTop: 10 }}>
//         <label>
//           FPS de extracción:{" "}
//           <input
//             type="number"
//             min={1}
//             max={10}
//             value={fps}
//             onChange={(e) => setFps(Number(e.target.value))}
//           />
//         </label>
//       </div>

//       <div style={{ marginTop: 10 }}>
//         <label>
//           Formato de exportación:{" "}
//           <select value={format} onChange={(e) => setFormat(e.target.value as any)}>
//             <option value="txt">TXT</option>
//             <option value="excel">Excel</option>
//             <option value="both">Ambos</option>
//           </select>
//         </label>
//       </div>

//       {videoFile && !processing && (
//         <button onClick={handleProcess} style={{ marginTop: 10 }}>
//           Procesar Video
//         </button>
//       )}

//       {processing && <p>Procesando video, por favor espera... ⏳</p>}

//       {clients.length > 0 && (
//         <div style={{ marginTop: 20 }}>
//           <button onClick={downloadClients}>Descargar archivos</button>
//           <h3>Clientes extraídos:</h3>
//           <ul>
//             {clients.map((c, idx) => (
//               <li key={idx}>
//                 {c.numero} - {c.nombre} - {c.direccion} - {c.codigoPostal}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }









import { useEffect, useState, ChangeEvent } from "react";
import { useVideoProcessing } from "../hooks/useVideoProcessing";
import { generateClientsTxt } from "../utils/exportTxt";
import { downloadTxtFile } from "../utils/downloadFile";
import { generateClientsExcel } from "../utils/exportExcel";

type ExportOption = "txt" | "excel";

export default function VideoUpload() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [fps, setFps] = useState<number>(0.2);
  const [exportOptions, setExportOptions] = useState<ExportOption[]>([]);
  const [downloaded, setDownloaded] = useState(false);

  const { processing, clients, processVideo } = useVideoProcessing();

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("video/")) {
      alert("Selecciona un video válido");
      return;
    }
    setVideoFile(file);
    setDownloaded(false);
  };

  const toggleExportOption = (option: ExportOption) => {
    setExportOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleProcess = async () => {
    if (!videoFile || exportOptions.length === 0) {
      alert("Selecciona al menos un formato de exportación");
      return;
    }
    await processVideo(videoFile, fps);
  };

// const handleProcess = async () => {
//   if (!videoFile) return;

//   // Crear video y canvas en el hilo principal
//   const video = document.createElement("video");
//   video.src = URL.createObjectURL(videoFile);

//   await new Promise<void>((resolve) => {
//     video.onloadedmetadata = () => resolve();
//   });

//   const canvas = document.createElement("canvas");
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   const ctx = canvas.getContext("2d")!;
  
//   // Capturar frames
//   const frames: Blob[] = [];
//   const fps = 1; // o lo que el usuario indique
//   for (let t = 0; t < video.duration; t += 1 / fps) {
//     video.currentTime = t;
//     await new Promise<void>((resolve) => {
//       video.onseeked = () => resolve();
//     });

//     // Dibujar frame en canvas y generar blob
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
//     if (blob) frames.push(blob);
//   }

//   // Enviar los frames al worker para OCR
//   worker.postMessage({ frames });
// };


  // ⬇️ DESCARGA AUTOMÁTICA
  useEffect(() => {
  if (!processing && clients.length > 0 && !downloaded) {
    (async () => {
      if (exportOptions.includes("txt")) {
        const txtContent = generateClientsTxt(clients);
        downloadTxtFile(txtContent);
      }

      if (exportOptions.includes("excel")) {
        await generateClientsExcel(clients);
      }

      setDownloaded(true);
    })();
  }
}, [processing, clients, downloaded, exportOptions]);
  // useEffect(() => {
  //   if (!processing && clients.length > 0 && !downloaded) {
  //     (async () => {
  //       if (exportOptions.includes("txt")) {
  //         const txtContent = generateClientsTxt(clients);
  //         downloadTxtFile(txtContent);
  //       }

  //       if (exportOptions.includes("excel")) {
  //         await generateClientsExcel(clients);
  //       }

  //       setDownloaded(true);
  //     })();
  //   }
  // }, [processing, clients, downloaded, exportOptions]);

  return (
    <div style={{ padding: 20 }}>
      <h1>👋 Extractor de clientes</h1>

      <input type="file" accept="video/*" onChange={handleUpload} />

      {/* <div style={{ marginTop: 10 }}>
        <label>
          FPS:
          <input
            type="number"
            min={1}
            max={10}
            value={fps}
            onChange={(e) => setFps(Number(e.target.value))}
          />
        </label>
      </div> */}

      <div style={{ marginTop: 15 }}>
        <strong>Formato de descarga:</strong>
        <div>
          <label>
            <input
              type="checkbox"
              checked={exportOptions.includes("txt")}
              onChange={() => toggleExportOption("txt")}
            />
            TXT
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={exportOptions.includes("excel")}
              onChange={() => toggleExportOption("excel")}
            />
            Excel (.xlsx)
          </label>
        </div>
      </div>

      {videoFile && !processing && !downloaded && (
        <button onClick={handleProcess} style={{ marginTop: 15 }}>
          Procesar video
        </button>
      )}

      {processing && <p>Procesando video... ⏳</p>}
      {downloaded && <p>✅ Descarga completada</p>}
    </div>
  );
}


