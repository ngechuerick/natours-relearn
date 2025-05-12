# Natours Relearn

## Project Overview

**Natours Relearn** is a Node.js and Express-based web application designed to help developers relearn and practice building APIs with Express, MongoDB, and various modern JavaScript tools. The project integrates features like user authentication, payment processing, map integration, and email notifications, making it a comprehensive learning tool for full-stack development. The frontend uses Pug templates and Parcel for bundling JavaScript, with Mapbox for geospatial visualizations.

This project serves as a hands-on way to explore:

- Building RESTful APIs with **Express** and **MongoDB**.
- Implementing secure authentication with **JWT** and **bcryptjs**.
- Handling payments with **Stripe**.
- Enhancing security with packages like **helmet** and **express-rate-limit**.
- Rendering dynamic views with **Pug**.
- Scheduling tasks with **node-cron**.

## Api reference link

[Postman API](https://documenter.getpostman.com/view/33499698/2sAYXFjJBX)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd natoursrelearn
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the required variables (e.g., MongoDB URI, JWT secret, Stripe keys, Mapbox token, email credentials). Example:

   ```env
   NODE_ENV=development
   MONGO_URI=specified mongodb url
   JWT_SECRET=your-secret-key
   STRIPE_SECRET_KEY=your-stripe-key
   MAPBOX_TOKEN=your-mapbox-token
   EMAIL_USERNAME=your-email-username
   EMAIL_PASSWORD=your-email-password
   ```

4. **Run the Application**:

   - Development mode (with file watching):
     ```bash
     npm run start:dev
     ```
   - Production mode:
     ```bash
     npm run start:prod
     ```
   - Debug mode (using `ndb`):
     ```bash
     npm run debug
     ```
   - Development with JavaScript bundling:
     ```bash
     npm run dev
     ```

5. **Access the Application**:
   Open `http://localhost:3000` in your browser (or the port specified in your configuration).

## Scripts

- `npm start`: Runs the server with Node.js.
- `npm run start:dev`: Runs the server in development mode with file watching.
- `npm run start:prod`: Runs the server in production mode.
- `npm run debug`: Runs the server with `ndb` for debugging.
- `npm run watch:js`: Watches and bundles JavaScript files using Parcel.
- `npm run build:js`: Builds JavaScript files for production.
- `npm run dev`: Runs both the server and JavaScript watcher in parallel.

## Dependencies

The project uses a variety of packages to handle backend, frontend, security, and external integrations. Below is a breakdown of the key dependencies and their purposes:

- **`@babel/polyfill@^7.12.1`**: Provides polyfills for older browsers to support modern JavaScript features (used with `core-js`).
- **`@stripe/stripe-js@^7.1.0`**: Client-side library for integrating Stripe payments (e.g., rendering payment forms).
- **`axios@^1.7.9`**: Promise-based HTTP client for making API requests from the frontend or backend.
- **`bcryptjs@^2.4.3`**: Hashes passwords securely for user authentication.
- **`compression@^1.8.0`**: Compresses HTTP responses to improve performance.
- **`cookie-parser@^1.4.7`**: Parses cookies in HTTP requests, useful for authentication.
- **`core-js@^3.41.0`**: Provides modular polyfills for modern JavaScript features.
- **`cors@^2.8.5`**: Enables Cross-Origin Resource Sharing for API access from different domains.
- **`dotenv@^16.4.7`**: Loads environment variables from a `.env` file into `process.env`.
- **`eslint-config-prettier@^10.1.2`**: Disables ESLint rules that conflict with Prettier for consistent code formatting.
- **`eslint-plugin@^1.0.1`, `eslint-plugin-node@^11.1.0`**: ESLint plugins for additional linting rules, including Node.js-specific checks.
- **`express@^4.21.2`**: Fast, minimalist web framework for building the API and handling routes.
- **`express-mongo-sanitize@^2.2.0`**: Prevents MongoDB injection attacks by sanitizing user input.
- **`express-rate-limit@^7.5.0`**: Limits repeated requests to prevent brute-force attacks.
- **`helmet@^8.0.0`**: Secures Express apps by setting secure HTTP headers.
- **`hpp@^0.2.3`**: Protects against HTTP parameter pollution attacks.
- **`jsonwebtoken@^9.0.2`**: Generates and verifies JSON Web Tokens for user authentication.
- **`mapbox-gl@^3.11.0`**: Renders interactive maps for geospatial data visualization.
- **`mongoose@^8.9.5`**: MongoDB object modeling for Node.js, simplifying database interactions.
- **`morgan@^1.10.0`**: Logs HTTP requests for debugging and monitoring.
- **`multer@1.4.5-lts.2`**: Handles multipart/form-data for file uploads (e.g., images).
- **`ndb@^1.1.5`**: Node.js debugger for debugging the application.
- **`node-cron@^3.0.3`**: Schedules recurring tasks (e.g., automated jobs or cleanup).
- **`nodemailer@^6.10.0`**: Sends emails (e.g., for password resets or notifications).
- **`pug@^3.0.3`**: Template engine for rendering dynamic HTML views.
- **`regenerator-runtime@^0.14.1`**: Runtime for compiled async/await code (used with Babel).
- **`sharp@^0.34.1`**: High-performance image processing for resizing and formatting images.
- **`slugify@^1.6.6`**: Generates URL-friendly slugs from text (e.g., for post titles).
- **`stripe@^18.0.0`**: Server-side library for processing Stripe payments.
- **`validator@^13.12.0`**: Validates and sanitizes strings (e.g., emails, URLs).

## DevDependencies

These packages are used during development for building, linting, and formatting the codebase:

- **`@babel/core@^7.12.0`, `@babel/preset-env@^7.26.9`**: Babel core and preset for transpiling modern JavaScript to support older browsers.
- **`@eslint/js@^9.19.0`**: ESLint JavaScript rules for consistent linting.
- **`@parcel/babel-preset-env@^2.13.3`**: Babel preset for Parcel to handle JavaScript transpilation.
- **`buffer@^5.5.0||^6.0.0`**: Polyfill for Node.js Buffer in browser environments.
- **`cross-env@^7.0.3`**: Sets environment variables across platforms (e.g., `NODE_ENV=production`).
- **`eslint@^9.19.0`**: Lints JavaScript code to enforce coding standards.
- **`globals@^16.0.0`**: Defines global variables for ESLint to avoid false positives.
- **`npm-run-all@^4.1.5`**: Runs multiple npm scripts in parallel or sequentially.
- **`parcel@^2.13.3`**: Bundles JavaScript, CSS, and other assets for the frontend.
- **`prettier@^3.4.2`**: Formats code for consistent style.
- **`process@^0.11.10`**: Polyfill for Node.js `process` in browser environments.

## Project Structure

- **`public/js/index.js`**: Entry point for frontend JavaScript, bundled by Parcel.
- **`server.js`**: Main server file for the Express application.
- **`public/js/dist/`**: Output directory for bundled JavaScript files(for frontend Javascript).
- **`.env`**: Environment variables (not tracked in version control).

## Key Features

- **User Authentication**: Secure login and signup with JWT and bcryptjs.
- **Payment Processing**: Stripe integration for handling payments.
- **Map Integration**: Mapbox GL for displaying geospatial data.
- **File Uploads**: Multer for handling image uploads, processed with Sharp.
- **Email Notifications**: Nodemailer for sending emails.
- **Scheduled Tasks**: Node-cron for automating recurring tasks.
- **Security**: Helmet, rate limiting, and input sanitization for robust protection.
- **Dynamic Views**: Pug templates for server-side rendering.

## Requirements

- **Node.js**: Version >10.0.0 (specified in `engines`).
- **MongoDB**: A running MongoDB instance (local or cloud-based).
- **Accounts**: API keys for Stripe, Mapbox, and an email service (e.g., Gmail, SendGrid).

## Contributing

Contributions are welcome! Please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Acknowledgments

This project is not my original creation but as a result of learning Nodejs with Jonas Schmedtman. So all credit goes to him and his team.
