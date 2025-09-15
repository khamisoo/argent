<h1 align="center">FindMe Argent Family Web App</h1>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D16-brightgreen?logo=node.js" />
  <img src="https://img.shields.io/badge/express-latest-blue?logo=express" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  <img src="https://img.shields.io/badge/tests-passing-success?logo=jest" />
</p>

---

## Overview

FindMe Argent is a secure, family-focused Node.js/Express web app for real-time location alerts, private messaging, and notifications. It uses EJS for views, MongoDB for storage, Passport for authentication, and Nodemailer for email alerts.

---

## ✨ Features

- **Landing page with login (firstname + phone)**
- **Session-based authentication (Passport, express-session)**
- **Main page with 3 sections:**
  - Got Me Now: Send your location (with device/IP info) to a family email
  - Missing Message: Send a message to another user (with mention, email alert)
  - Received Messages: Inbox for messages sent to you
- **Email notification opt-in (toggle)**
- **CSP, CORS, Helmet, and rate limiting for security**
- **Swagger UI for API docs**
- **Winston logging, error handling, and modular MVC structure**

---

## 🚀 Quickstart

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/argent.git
   cd argent
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create your `.env` file:**
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/argentM-db
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_PASS=your_gmail_app_password
   SESSION_SECRET=your_secret
   ```
4. **Add your initial users:**
   - Edit `users.json` (see below for format)
   - This file is ignored by git for privacy. Each user must have: `firstname`, `phone`, `email`, `notify` (true/false)
5. **Start MongoDB** (if not using Atlas):
   ```bash
   mongod
   ```

6. **Run the app (Production):**
   ```bash
   npm start
   ```
   - Runs the app with production settings (optimized logging, no auto-reload).

7. **Run in development mode:**
   ```bash
   npm run dev
   ```
   - Uses nodemon for auto-reload and verbose logging.

8. **Run all tests:**
   ```bash
   npm test
   ```
   - Runs Jest/Supertest tests.

9. **Open in browser:**
   - App: [http://localhost:3000](http://localhost:3000)
   - Swagger API docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## � File & Folder Structure

```
argent/
├── logs/                # Winston logs
├── public/              # Static assets (JS, CSS)
├── src/
│   ├── app.js           # Express app setup
│   ├── server.js        # App entry point
│   ├── config/          # CORS, DB, env config
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Error/auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── utils/           # Logger, ApiError, importUsers
│   └── views/           # EJS templates
├── tests/               # Jest/Supertest tests
├── users.json           # User data (ignored by git)
├── .env                 # Environment variables (ignored by git)
├── .gitignore           # Files to ignore in git
├── package.json         # Project metadata
└── README.md            # This file
```

---

## 🗂️ users.json Format (Required After Clone)

This file is ignored by git. You must create it after cloning:

```json
[
  {
    "firstname": "Ezz",
    "phone": "01000099800",
    "email": "something@example.com",
    "notify": true
  },
  {
    "firstname": "Nour",
    "phone": "01109999990",
    "email": "another@example.com",
    "notify": true
  }
]
```

---

## 🛡️ .gitignore Highlights

Sensitive/user-specific files you must create after cloning:

- `.env` (environment variables)
- `users.json` (user data)

Other ignored files:
- `node_modules/`, `logs/`, `coverage/`, `dist/`, `build/`, `.vscode/`, etc.

---

## 📝 API & Swagger Docs

- All REST endpoints are documented at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Try out endpoints directly in the browser

---

## 🧪 Testing

Run all tests:
```bash
npm test
```

---

## 🤝 Contributing & Support

Open issues or PRs for bugs, features, or questions. For help, contact the maintainer.

---

## 📄 License

MIT
---



💡 Made with ❤️ by **AK** → [@Abdelhameed\_k\_](https://x.com/Abdelhameed_k_)

```
