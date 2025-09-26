const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000; // Puedes usar el puerto que quieras
const videoRoutes = require("./routes/videoRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", videoRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
