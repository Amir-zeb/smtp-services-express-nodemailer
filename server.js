var express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require("morgan");
require('dotenv').config();
const { sendEmail } = require('./services/sendEMail');

// Swagger dependencies
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
app.use(morgan("dev"));

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Simple API',
            version: '1.0.0',
            description: 'A simple Express API',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`
            }
        ],
    },
    apis: ['./server.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     ResendOtp:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *       example:
 *         email: cooper@yopmail.com
 */

/**
 * @swagger
 * tags:
 *   - name: OTP
 *     description: Operations related to OTP
 */

/**
 * @swagger
 * /api/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     description: Send OTP to the provided email
 *     tags:
 *      - OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOtp'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/ResendOtp'
 *     responses:
 *       200:
 *         description: Otp has been sent to your email.
 *       422:
 *         description: Email not provided
 *       500:
 *         description: An error occurred
 */
app.post('/api/resend-otp', async (req, res) => {
    const { email } = req.body;
    if (!email && !isValidEmail(email)) {
        return res.status(422).json({ message: 'email not provided' });
    }
    try {
        await sendEmail('otp', email, "Otp", { otp: '6644' })
        return res.status(200).json({ message: "Otp has been sent to your email." });
    } catch (error) {
        console.log("🚀 ~ app.post ~ error:", error)
        return res.status(500).json({ error });
    }
});

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