/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     description: Returns a welcome message for the FindMe Argent API
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
const express = require('express');
const router = express.Router();
const { getRoot } = require('../controllers/root.controller');

router.get('/', getRoot);

module.exports = router;