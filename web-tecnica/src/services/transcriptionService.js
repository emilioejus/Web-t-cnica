export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append("video", file);

  // const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
  //   method: "POST",
  //   body: formData,
  // });
    const response = await fetch(`${import.meta.env.VITE_API_URL}/procesar-video`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir el video");
  }

  // return response.json();

    // Recibir el archivo como blob
  const blob = await response.blob();

  // Crear un link temporal para descargar el archivo
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resultado.xlsx"; // nombre del archivo
  document.body.appendChild(a);
  a.click();
  a.remove();

  return { success: true, message: "Archivo descargado" };
}