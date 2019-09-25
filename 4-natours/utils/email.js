const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1. Create transporter
  // Service that will actually send the email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    // ACTIVATE in gmail 'less secure app' option
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'Jonas Schmedtmann <test@ucsd.edu',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html: options.html
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
