
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Login with firstname and phone number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirects to /main on success
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout user
 *     description: Ends the user session and redirects to landing page.
 *     responses:
 *       302:
 *         description: Redirects to /
 */

const express = require('express');
const router = express.Router();
const { registerOrLogin, logout } = require('../controllers/auth.controller');

router.post('/login', registerOrLogin);
router.get('/logout', logout);

module.exports = router;
