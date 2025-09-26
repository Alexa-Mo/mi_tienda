import 'dotenv/config';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import cors from "cors";
import orderMailRouter from "./orderMail.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Paths absolutos para __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS (ajusta el dominio del frontend cuando despliegues)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// API
app.use("/api", orderMailRouter);

let db;
(async () => {
  db = await open({
    filename: path.join(__dirname, "users.db"), // 🔹 aseguramos ruta absoluta
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
})();

// Rutas de auth
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashed]);
    res.json({ success: true, user: { email, name: email.split("@")[0] } });
  } catch (err) {
    res.json({ success: false, message: "Correo ya registrado" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.json({ success: false, reason: "not_found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.json({ success: false, message: "Contraseña incorrecta" });

    res.json({ success: true, user: { email: user.email, name: email.split("@")[0] } });
  } catch (err) {
    res.json({ success: false, message: "Error en el servidor" });
  }
});

// Servir frontend compilado
//app.use(express.static(path.join(__dirname, "dist")));

// Ruta fallback para React Router
//app.get("*", (req, res) => {
//  res.sendFile(path.join(__dirname, "dist", "index.html"));
//});

// 🔹 Escuchar en 0.0.0.0 (requerido en Render)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
