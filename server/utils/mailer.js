const { Resend } = require('resend');

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

let verificationAttempted = false;

// Dummy method to avoid breaking existing code
const getTransporter = () => {
  return null;
};

// Instead of verifying SMTP, we just verify if API Key exists
const verifyTransporter = async () => {
  if (verificationAttempted) return;
  verificationAttempted = true;

  if (resendApiKey) {
    console.log('✅ Resend API Key found. Email system ready via HTTPS.');
    return true;
  } else {
    console.error('❌ Resend API Key is missing from .env');
    return false;
  }
};

const sendMail = async (mailOptions) => {
  try {
    // If no custom domain is verified on Resend, you MUST use onboarding@resend.dev
    // and it can only send to the email you used to sign up for Resend. 
    // You can update RESEND_FROM in your Render Environment Variables once you add a custom domain.
    const fromAddress = process.env.RESEND_FROM || 'Blood Alert System <onboarding@resend.dev>';

    console.log(`\n📤 Sending email via Resend to: ${mailOptions.to}`);
    console.log(`   Subject: ${mailOptions.subject}`);
    console.log(`   From: ${fromAddress}`);

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      reply_to: process.env.EMAIL || 'bloodalert01@gmail.com', // Replies will go directly to your Gmail!
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text,
    });

    if (error) {
      console.error(`❌ Failed to send email to ${mailOptions.to} via Resend:`, error);
      return null;
    }

    console.log(`✅ Email sent successfully via Resend! Message ID: ${data.id}`);
    return data;
  } catch (err) {
    console.error(`❌ Unexpected error sending email to ${mailOptions.to}:`, err.message);
    // Don't re-throw to allow other operations to continue
    return null;
  }
};

module.exports = { getTransporter, sendMail, verifyTransporter };
