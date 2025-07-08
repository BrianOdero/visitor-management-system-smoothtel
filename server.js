import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

//for importing .env variables
import dotenv from "dotenv";
dotenv.config();

// Set up the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://localhost:5173',
    'http://localhost:3000',
    'https://localhost:3000'
  ], // Support both HTTP and HTTPS frontend URLs
  credentials: true
}));
app.use(express.json());

// Create Gmail transporter using App Password
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "odero7537@gmail.com",
    pass: process.env.EMAIL_PASS || "uffy hiww iefk ohsw"
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter is ready to send emails');
  }
});

// API route to send email
app.post("/api/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Validate required fields
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: to, subject, and either text or html"
    });
  }

  try {
    const info = await transporter.sendMail({
      from: `"Smoothtel Visitor System" <${process.env.EMAIL_USER || "odero7537@gmail.com"}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Email sent to:", to);
    console.log("Subject:", subject);

    res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to send email",
      details: error.message 
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Email service is running",
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Email server running at http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});