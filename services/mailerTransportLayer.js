// services/mailerTransportLayer.js
const nodemailer = require('nodemailer');

// Create a transporter using the SMTP details
const nodeMailerTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL, // Your Gmail email address
        pass: process.env.PASS_KEY // Your Gmail password or app password
    }
});

module.exports = { nodeMailerTransporter };