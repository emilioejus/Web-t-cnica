export async function extractFrames(
  videoFile: File,
  fps: number
): Promise<Blob[]> {
  const video = document.createElement("video");
  video.src = URL.createObjectURL(videoFile);

  await video.play().catch(() => {});
  video.pause();

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 360;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  const duration = video.duration;
  const frames: Blob[] = [];

  for (let t = 0; t < duration; t += fps) {
    video.currentTime = t;
    await new Promise<void>((res) => (video.onseeked = () => res()));

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/png")
    );

    if (blob) frames.push(blob);
  }

  return frames;
}