
const transporter = require('../config/email');

const sendEmail = async (options) => {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM}`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
