const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Transporter oluştur (Gmail SMTP)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Mail seçenekleri
  const mailOptions = {
    from: `EduVerse <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // E-postayı gönder
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
