const nodemailer = require('nodemailer');

const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || 587, 10);
  const smtpSecure = process.env.SMTP_SECURE === 'true' ? true : false;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  const opts = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    tls: {
      rejectUnauthorized: false
    }
  };

  console.log('📧 Mailer config:', { 
    host: opts.host, 
    port: opts.port, 
    secure: opts.secure, 
    user: opts.auth.user,
    hasPassword: !!opts.auth.pass 
  });

  return nodemailer.createTransport(opts);
};

let transporter = null;
let verificationAttempted = false;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

const verifyTransporter = async () => {
  if (verificationAttempted) return;
  verificationAttempted = true;

  try {
    const t = getTransporter();
    await t.verify();
    console.log('✅ Email transporter verified successfully');
    return true;
  } catch (err) {
    console.error('❌ Email transporter verification failed:', err.message);
    return false;
  }
};

const sendMail = async (mailOptions) => {
  try {
    const t = getTransporter();

    // Ensure from field is set
    if (!mailOptions.from) {
      mailOptions.from = process.env.EMAIL_FROM || process.env.EMAIL || 'noreply@blood.local';
    }

    console.log(`\n📤 Sending email to: ${mailOptions.to}`);
    console.log(`   Subject: ${mailOptions.subject}`);
    console.log(`   From: ${mailOptions.from}`);

    const info = await t.sendMail(mailOptions);
    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${mailOptions.to}:`, err.message);
    // Don't re-throw to allow other operations to continue
    return null;
  }
};

module.exports = { getTransporter, sendMail, verifyTransporter };
