import nodemailer from "nodemailer";
import express from "express";

const router = express.Router();

// Configura tu cuenta de correo aquí
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_PASS  // tu contraseña o app password
  }
});

router.post("/send-order", async (req, res) => {
  const { name, email, phone, city, deliveryType, address, comments, cart, total } = req.body;
  let html = `<h2>¡Nueva compra en la tienda online!</h2>
    <p><b>Nombre:</b> ${name}</p>
    <p><b>Correo:</b> ${email}</p>
    <p><b>Teléfono:</b> ${phone}</p>
    <p><b>Ciudad:</b> ${city}</p>
    <p><b>Tipo de entrega:</b> ${deliveryType === 'delivery' ? 'Envío a domicilio' : 'Recoger en tienda'}</p>
    ${deliveryType === 'delivery' ? `<p><b>Dirección:</b> ${address}</p>` : ''}
    <p><b>Comentarios:</b> ${comments || 'Ninguno'}</p>
    <h3>Productos:</h3>
    <ul>`;
  for (const item of cart) {
    html += `<li>${item.name} x${item.quantity} - $${item.price}</li>`;
  }
  html += `</ul><p><b>Total:</b> $${total}</p>`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email, // enviar al cliente
      subject: "Confirmación de compra - Tienda Online",
      html
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error enviando correo" });
  }
});

export default router;
