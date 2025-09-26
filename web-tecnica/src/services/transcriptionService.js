export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append("video", file);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir el video");
  }

  return response.json();
}