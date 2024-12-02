const nodemailer = require('nodemailer');
const { db } = require('../config/firebase');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendNotification = async (userId, productId, viewCount) => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userData.email,
      subject: 'Product View Notification',
      text: `You have viewed product ${productId} ${viewCount} times recently.`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email notification error:', error);
  }
};

module.exports = { sendNotification };