const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

// Basic rate limiting to mitigate spam
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Create reusable transporter object using SMTP or JSON transport in test env
function createTransport() {
  if (process.env.NODE_ENV === 'test') {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const transporter = createTransport();

app.post('/api/contact', async (req, res) => {
  const { nom, email, msg } = req.body || {};
  if (!nom || !email || !msg) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const mail = {
    from: process.env.SMTP_FROM || 'no-reply@ostanin-rse.fr',
    to: 'contact@ostanin-rse.fr',
    subject: `[Site RSE] Message de ${nom}`,
    text: `Nom: ${nom}\nEmail: ${email}\n\n${msg}`,
  };

  try {
    await transporter.sendMail(mail);
    res.json({ ok: true });
  } catch (err) {
    console.error('Mail error', err);
    res.status(500).json({ error: 'send_fail' });
  }
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
