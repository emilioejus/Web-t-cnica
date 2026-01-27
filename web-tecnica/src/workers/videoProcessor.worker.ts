/// <reference lib="webworker" />
import Tesseract from "tesseract.js";
import { extractClientData } from "../utils/regex";
import { ClientData } from "../services/ocrSrvice";

interface WorkerMessage {
  frames: Blob[];
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { frames } = event.data;
  let allClients: ClientData[] = [];

  for (const frame of frames) {
    const { data: { text } } = await Tesseract.recognize(frame, "spa");
    const clients = extractClientData(text);
    allClients.push(...clients);
  }

  // Deduplicar
  const uniqueClients = Array.from(new Map(allClients.map(c => [c.numero, c])).values());
  self.postMessage({ clients: uniqueClients });
};








// /// <reference lib="webworker" />
// import Tesseract from "tesseract.js";
// import { extractClientData } from "../utils/regex";
// import { ClientData } from "../services/ocrSrvice";

// interface WorkerMessage {
//   file: File; // ahora enviamos el video completo
//   fps: number;
// }

// self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
//   const { file, fps } = event.data;

//   const video = document.createElement("video");
//   video.src = URL.createObjectURL(file);

//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");
//   if (!ctx) return;

//   await new Promise<void>((resolve) => {
//     video.onloadedmetadata = () => {
//       canvas.width = video.videoWidth || 640;
//       canvas.height = video.videoHeight || 360;
//       resolve();
//     };
//   });

//   let allClients: ClientData[] = [];

//   // ✅ Aquí va tu bucle que me preguntaste
//   for (let t = 0; t < video.duration; t += 1 / fps) {
//     await new Promise<void>((resolve) => {
//       const handler = () => {
//         video.removeEventListener("seeked", handler);
//         setTimeout(resolve, 50); // espera 50ms para renderizar el frame
//       };
//       video.addEventListener("seeked", handler);
//       video.currentTime = t;
//     });

//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const blob = await new Promise<Blob | null>((resolve) =>
//       canvas.toBlob(resolve, "image/png")
//     );

//     if (blob) {
//       const { data: { text } } = await Tesseract.recognize(blob, "spa", {
//         tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑabcdefghijklmnopqrstuvwxyz0123456789,.-"
//       });

//       const clientsInFrame = extractClientData(text);
//       allClients.push(...clientsInFrame);
//     }
//   }

//   // Deduplicar después de procesar todos los frames
//   const uniqueClients = Array.from(
//     new Map(allClients.map(c => [c.numero, c])).values()
//   );

//   self.postMessage({ clients: uniqueClients });
// };