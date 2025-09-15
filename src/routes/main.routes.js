
/**
 * @swagger
 * /main:
 *   get:
 *     summary: Main app page
 *     description: Renders the main page for authenticated users.
 *     responses:
 *       200:
 *         description: Main page HTML
 *       302:
 *         description: Redirects to login if not authenticated
 */
/**
 * @swagger
 * /main/gotme:
 *   post:
 *     summary: Got Me Now location alert
 *     description: Send your location, IP, and device info to the family email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Main page with success or error message
 *       302:
 *         description: Redirects to login if not authenticated
 */
/**
 * @swagger
 * /main/message:
 *   post:
 *     summary: Send missing message
 *     description: Send a message to another user (mention by firstname). Notifies by email if enabled.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               mention:
 *                 type: string
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               mention:
 *                 type: string
 *     responses:
 *       200:
 *         description: Main page or JSON with success/error
 *       400:
 *         description: Missing fields
 *       404:
 *         description: Mentioned user not found
 *       302:
 *         description: Redirects to login if not authenticated
 */
/**
 * @swagger
 * /main/notify:
 *   post:
 *     summary: Toggle email notification preference
 *     description: Enable or disable email alerts for the logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notify:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: JSON with updated notify status
 *       401:
 *         description: Not authenticated
 */

const express = require('express');
const router = express.Router();
const { getMain, gotMeNow, missingMessage, toggleNotify } = require('../controllers/main.controller');
const isAuth = require('../middlewares/isAuth');

router.get('/', isAuth, getMain);
router.post('/gotme', isAuth, gotMeNow);
router.post('/message', isAuth, missingMessage);
router.post('/notify', isAuth, toggleNotify);

module.exports = router;
