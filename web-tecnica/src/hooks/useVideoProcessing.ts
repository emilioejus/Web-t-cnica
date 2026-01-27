import { useState } from "react";
import VideoWorker from "../workers/videoProcessor.worker?worker";
import { ClientData } from "../services/ocrSrvice";
import { extractFrames } from "../utils/extractFrames";

export function useVideoProcessing() {
  const [processing, setProcessing] = useState(false);
  const [clients, setClients] = useState<ClientData[]>([]);

  const processVideo = async (file: File, fps: number) => {
    setProcessing(true);

    const frames = await extractFrames(file, fps);
    const worker = new VideoWorker();

    worker.postMessage({ frames });

    worker.onmessage = (e: MessageEvent<{ clients: ClientData[] }>) => {
      setClients(e.data.clients);
      setProcessing(false);
      worker.terminate();
    };

    worker.onerror = () => {
      setProcessing(false);
      worker.terminate();
    };
  };

  return { processing, clients, processVideo };
}