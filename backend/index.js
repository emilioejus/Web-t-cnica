const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

const videoRoutes = require("./src/routes/video.routes");

// Middlewares
// app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://tu-frontend.netlify.app"
  ]
}));
app.use(express.json());

// Rutas
app.use("/api", videoRoutes);

// Ruta health (opcional pero recomendada)
app.get("/", (req, res) => {
  res.send("Backend Web Técnica activo 🚀");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
