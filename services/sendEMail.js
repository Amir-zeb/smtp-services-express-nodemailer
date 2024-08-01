const path = require('path');
require('dotenv').config();
const fs = require('fs');
const handlebars = require('handlebars');
const { nodeMailerTransporter } = require('./mailerTransportLayer');

async function sendEmail(templateName, to, subject, data) {
    // Get the absolute file path
    const templatePath = path.resolve(__dirname, `../templates/${templateName}Template.html`);
    // Load the email template file
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    // Compile the template
    const template = handlebars.compile(templateSource);
    // Compile the template with user data
    const html = template(data);

    // Compose the email message
    const mailOptions = {
        from: process.env.GMAIL, // Replace with your email address
        to: to, // Replace with the recipient email address
        subject: subject,
        html: html
    };

    // Send the email
    nodeMailerTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, status: 500, message: "An error occurred while sending the email.", error });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ success: true, status: 200, message: "Thank you for contacting us!" });
        }
    });
}

module.exports = { sendEmail };