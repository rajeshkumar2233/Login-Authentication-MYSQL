const nodemailer = require('nodemailer');

// Transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajeshmajhi2233@gmail.com', 
    pass: 'Rajesh@123' 
  }
});


const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: 'rajeshmajhi2233@gmail.com', 
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendEmail;
