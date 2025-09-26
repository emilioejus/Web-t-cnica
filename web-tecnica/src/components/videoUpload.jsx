import { useState } from "react";
import styles from "../styles/videoUpload.module.css";
import { uploadVideo } from "../services/transcriptionService";

function VideoUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      setResponse(null);
    } else {
      alert("Por favor selecciona un archivo de video válido.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const result = await uploadVideo(file);
      setResponse(result);
    } catch (err) {
      console.error(err);
      alert("Error al enviar el video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>👋 ¡Hola! Sube tu video</h1>
      <p className={styles.subtitle}>
        Selecciona un video para transformarlo en información de texto.
      </p>

      <label htmlFor="videoInput" className={styles.uploadButton}>
        Elegir video
      </label>
      <input
        id="videoInput"
        type="file"
        accept="video/*"
        className={styles.input}
        onChange={handleFileChange}
      />

      {file && (
        <div className={styles.preview}>
          <p className={styles.filename}>{file.name}</p>
          <video
            className={styles.video}
            src={URL.createObjectURL(file)}
            controls
          />
          <button
            className={styles.sendButton}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar al backend"}
          </button>
        </div>
      )}

      {response && (
        <div className={styles.result}>
          <h2>📄 Respuesta del backend:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default VideoUpload;