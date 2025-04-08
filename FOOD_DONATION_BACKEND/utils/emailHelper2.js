const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailNotification = async (food) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: `Food Donation Platform <${process.env.GMAIL_ACCOUNT}>`, // Use platform branding
    to: food.donorEmail, // Send email to the donor
    subject: 'Food Request Confirmation',
    html: `
      <p><strong>Your food donation has been successfully requested!</strong></p>
      <p><strong>Food Details:</strong></p>
      <ul>
        <li>Type: ${food.foodType}</li>
        <li>Expiry Date: ${food.expiryDate}</li>
      </ul>
      <p>Thank you for your generous contribution! 🙌</p>
    `,
  };

  try {
    const isEmailSent = await transporter.sendMail(mailOptions);
    console.log('Food request email sent successfully:', isEmailSent);
    return isEmailSent;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmailNotification };
