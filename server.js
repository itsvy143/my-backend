const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();  // Load .env variables
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS loaded:", process.env.EMAIL_PASS ? "Yes" : "No");


const app = express();
const PORT = 5500;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files if needed

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,    // your Gmail address (from .env)
    pass: process.env.EMAIL_PASS,    // your Gmail app password (from .env)
  },
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Email options
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,    // Your Gmail to receive the message
    subject: `New contact form message from ${name}`,
    text: `You have a new message from your website contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
