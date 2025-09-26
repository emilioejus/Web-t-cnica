const ffmpeg = require("fluent-ffmpeg");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const processVideo = async (req, res) => {
  try {
    const videoPath = req.file.path; // Multer ya lo guarda en uploads/
    const framesDir = path.join(__dirname, "..", "frames");

    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir);
    }

    console.log("🎥 Procesando video:", videoPath);

    // 1️⃣ Extraer frames con FFmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(`${framesDir}/frame_%04d.png`)
        .outputOptions(["-vf fps=1"]) // 1 frame por segundo
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });

    console.log("🖼️ Frames generados en:", framesDir);

    // 2️⃣ OCR en cada frame
    const textos = [];
    const frameFiles = fs.readdirSync(framesDir);

    for (const file of frameFiles) {
      const framePath = path.join(framesDir, file);
      console.log("🔎 OCR en:", framePath);

      const { data } = await Tesseract.recognize(framePath, "eng"); // o "spa" para español
      textos.push(data.text.trim());
    }

    // 3️⃣ Crear Excel con resultados
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(textos.map((t) => [t]));
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");

    const outputFile = path.join(__dirname, "..", "resultado.xlsx");
    XLSX.writeFile(wb, outputFile);

    console.log("📂 Archivo Excel generado:", outputFile);

    // 4️⃣ Enviar archivo al cliente
    res.download(outputFile, "resultado.xlsx", (err) => {
      if (err) console.error("❌ Error al enviar archivo:", err);

      // 🧹 Limpieza temporal
      fs.unlinkSync(videoPath);
      fs.rmSync(framesDir, { recursive: true, force: true });
    });
  } catch (err) {
    console.error("❌ Error procesando video:", err);
    res.status(500).send("Error procesando video");
  }
};

module.exports = { processVideo };