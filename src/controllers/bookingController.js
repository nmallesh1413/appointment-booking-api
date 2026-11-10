const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

async function createBooking(req, res, next) {
  try {
    const { slotId } = req.body;
    const slot = await Slot.findById(slotId);

    if (!slot) {
      const error = new Error("Slot not found");
      error.statusCode = 404;
      return next(error);
    }

    if (new Date(slot.startTime) <= new Date()) {
      const error = new Error("Slot must be in the future");
      error.statusCode = 400;
      return next(error);
    }

    if (slot.status !== "available") {
      const error = new Error("This slot is already booked");
      error.statusCode = 409;
      return next(error);
    }

    const booking = await Booking.create({
      slot: slot._id,
      user: req.user._id,
      status: "booked",
    });

    slot.status = "booked";
    await slot.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("slot", "startTime endTime title price provider")
      .populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Slot booked successfully",
      data: populatedBooking,
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error("This slot has already been booked by another user");
      duplicateError.statusCode = 409;
      return next(duplicateError);
    }
    next(error);
  }
}

async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id, status: "booked" })
      .sort({ createdAt: -1 })
      .populate({
        path: "slot",
        select: "provider startTime endTime title price status",
        populate: { path: "provider", select: "name email" },
      })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("slot");

    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      return next(error);
    }

    if (String(booking.user) !== String(req.user._id)) {
      const error = new Error("You can only cancel your own bookings");
      error.statusCode = 403;
      return next(error);
    }

    if (booking.status === "cancelled") {
      const error = new Error("This booking has already been cancelled");
      error.statusCode = 409;
      return next(error);
    }

    booking.status = "cancelled";
    await booking.save();

    if (booking.slot) {
      booking.slot.status = "available";
      await booking.slot.save();
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createBooking, getMyBookings, cancelBooking };

