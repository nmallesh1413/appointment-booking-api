const express = require("express");
const { createSlot, getAvailableSlots, getMySlots } = require("../controllers/slotController");
const { createSlotRules } = require("../validators/slotValidators");
const validateRequest = require("../middleware/validateRequest");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

/**
 * @swagger
 * /api/slots:
 *   get:
 *     summary: Get all available slots
 *     tags: [Slots]
 *     responses:
 *       200:
 *         description: Available slots returned
 *   post:
 *     summary: Create a slot as a provider
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [startTime, endTime]
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Slot created
 */

/**
 * @swagger
 * /api/slots/my:
 *   get:
 *     summary: Get provider's own slots
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Provider slots returned
 */

const router = express.Router();

router.get("/", getAvailableSlots);
router.get("/my", protect, requireRole("provider"), getMySlots);
router.get("/provider", protect, requireRole("provider"), getMySlots);
router.post("/", protect, requireRole("provider"), createSlotRules, validateRequest, createSlot);

module.exports = router;
