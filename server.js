import 'dotenv/config';
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import cors from "cors";
import orderMailRouter from "./orderMail.js";

const app = express(); // Primero inicializamos Express
const PORT = 3001;

// Activar CORS para que el frontend pueda comunicarse
app.use(cors({
  origin: "http://localhost:5179", // el puerto donde corre Vite
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// Ruta para enviar correo de compra
app.use("/api", orderMailRouter);

let db;

// Inicializar SQLite
(async () => {
  db = await open({
    filename: "./users.db",
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

// Registro
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

// Login
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
