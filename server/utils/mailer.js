const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

let verificationAttempted = false;

const getTransporter = () => {
  return transporter;
};

const verifyTransporter = async () => {
  if (verificationAttempted) return;
  verificationAttempted = true;

  try {
    await transporter.verify();
    console.log('✅ SMTP Server is ready to take our messages');
    return true;
  } catch (error) {
    console.error('❌ SMTP Connection Error:', error);
    return false;
  }
};

const sendMail = async (mailOptions) => {
  try {
    // Ensure "from" is set to the SMTP user if not provided in mailOptions
    const fromAddress = mailOptions.from || process.env.EMAIL_FROM || process.env.EMAIL;
    
    const options = {
      ...mailOptions,
      from: fromAddress
    };

    console.log(`\n📤 Sending email via Nodemailer to: ${options.to}`);
    console.log(`   Subject: ${options.subject}`);
    console.log(`   From: ${options.from}`);

    const info = await transporter.sendMail(options);
    
    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Unexpected error sending email to ${mailOptions.to}:`, err.message);
    return null;
  }
};

module.exports = { getTransporter, sendMail, verifyTransporter };
