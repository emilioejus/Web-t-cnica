const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000; // Puedes usar el puerto que quieras

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de ejemplo
app.get("/api/saludo", (req, res) => {
  res.json({ mensaje: "Hola desde el backend con Node y Express 🚀" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
