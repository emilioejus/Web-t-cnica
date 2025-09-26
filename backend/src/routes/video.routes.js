const express = require("express");
const multer = require("multer");
const { processVideo } = require("../controllers/videoController");

const router = express.Router();

// 📂 Configuración de Multer (guardar temporalmente el video en uploads/)
const upload = multer({ dest: "uploads/" });

// 📌 Ruta para procesar video
router.post("/procesar-video", upload.single("video"), processVideo);

module.exports = router;