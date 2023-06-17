var express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require("morgan");
require('dotenv').config();
const fs = require('fs');
const handlebars = require('handlebars');
const { nodeMailerTransporter } = require('./services/mailerTransportLayer');

const app = express();

// cors options
const corsOptions = {
    origin: '*',
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionSuccessStatus: 200
}

// middleWares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, 'public')));


// Get the absolute file path
const templatePath = path.resolve(__dirname, './templates/contact-us-email-template.html');
// Load the email template file
const templateSource = fs.readFileSync(templatePath, 'utf8');
// Compile the template
const template = handlebars.compile(templateSource);

// api for nodemailer
app.post('/api/use-nodemailer', (req, res) => {
    // Handle the contact form submission
    const { name, email, phone_number, subject, message } = req.body;
    const errors = validateFields(name, email, subject, message);

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ success: false, status: 422, message: "ValidationError", errors });
    }

    // Compile the template with user data
    const html = template({ name, email, message, phone_number });

    // Compose the email message
    const mailOptions = {
        from: email, // Replace with your email address
        to: 'hobivi3374@anomgo.com', // Replace with the recipient email address
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
});

// Helper function to validate fields
function validateFields(name, email, subject, message) {
    const errors = {}
    if (!email) {
        errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
        errors.email = "Invalid email format";
    }
    if (!subject) {
        errors.subject = "Subject is required";
    }
    if (!name) {
        errors.name = "Name is required";
    }
    if (!message) {
        errors.message = "Message is required";
    } else if (message.length > 255) {
        errors.message = "Character limit exceeded";
    }
    return errors;
}

// Helper function to validate email format
function isValidEmail(email) {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// server running on http
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})