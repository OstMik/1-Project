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
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const missing = [];
  if (!SMTP_HOST) missing.push('SMTP_HOST');
  if (!SMTP_PORT) missing.push('SMTP_PORT');
  if (!SMTP_USER) missing.push('SMTP_USER');
  if (!SMTP_PASS) missing.push('SMTP_PASS');
  if (missing.length > 0) {
    console.error(`Missing SMTP config: ${missing.join(', ')}`);
    throw new Error('Missing SMTP configuration');
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

let transporter;
try {
  transporter = createTransport();
} catch (err) {
  console.error('Transporter setup failed', err);
}

app.post('/api/contact', async (req, res) => {
  const { nom, email, msg } = req.body || {};
  if (!nom || !email || !msg) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (!transporter) {
    return res.status(500).json({ error: 'smtp_unavailable' });
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
