const nodemailer = require('nodemailer');
require('dotenv').config();
const SendEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  let message = {
    from: `Food Bridge <${process.env.GMAIL_ACCOUNT}>`,
    to: email,
    subject: 'Opt verification from Food Bridge',
    html: `<p>Hello, you login otp is : <span>${otp}</span></p>`,
  };
  const isEmailsent = await transporter.sendMail(message);
  return isEmailsent;
};

module.exports = {
  SendEmail,
};
