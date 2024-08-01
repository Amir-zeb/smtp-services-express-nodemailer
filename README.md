# Simple Express API with Swagger

This is a simple Express API that includes a basic setup for sending OTP via email. The API uses Swagger for documentation.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Swagger Documentation](#swagger-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Amir-zeb/smtp-services-express-nodemailer.git
    cd simple-express-api
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:

    ```bash
    PORT=3000
    GMAIL=your-email@gmail.com
    GMAIL_PASSWORD=your-email-password
    ```

## Usage

1. Start the server:

    ```bash
    npm start
    ```

2. The API will be running at `http://localhost:3000`.

## API Endpoints

### Resend OTP

- **URL:** `/api/resend-otp`
- **Method:** `POST`
- **Request Body:**

    ```json
    {
      "email": "user@example.com"
    }
    ```

- **Responses:**

    - `200 OK`: OTP has been sent to your email.
    - `422 Unprocessable Entity`: Email not provided or invalid email format.
    - `500 Internal Server Error`: An error occurred while sending the email.

## Swagger Documentation

The API is documented using Swagger. You can view the interactive API documentation by navigating to `http://localhost:3000/api-docs` in your browser.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Make your changes and commit them: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-branch`
5. Submit a pull request.