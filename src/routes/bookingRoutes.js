const express = require("express");
const { createBooking, getMyBookings, cancelBooking } = require("../controllers/bookingController");
const { bookSlotRules, bookingIdRules } = require("../validators/bookingValidators");
const validateRequest = require("../middleware/validateRequest");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get current user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings returned
 *   post:
 *     summary: Book a slot
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slotId]
 *             properties:
 *               slotId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 */

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 */

router.get("/", protect, requireRole("user"), getMyBookings);
router.get("/my", protect, requireRole("user"), getMyBookings);
router.get("/me", protect, requireRole("user"), getMyBookings);
router.post("/", protect, requireRole("user"), bookSlotRules, validateRequest, createBooking);
router.post("/:id/cancel", protect, requireRole("user"), bookingIdRules, validateRequest, cancelBooking);
router.delete("/:id", protect, requireRole("user"), bookingIdRules, validateRequest, cancelBooking);

module.exports = router;
