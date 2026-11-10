const Slot = require("../models/Slot");

async function getAvailableSlots(req, res, next) {
  try {
    const query = {
      status: "available",
      startTime: { $gte: new Date() },
    };

    if (req.query.provider) {
      query.provider = req.query.provider;
    }

    const slots = await Slot.find(query)
      .sort({ startTime: 1 })
      .populate("provider", "name email role");

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
}

async function getMySlots(req, res, next) {
  try {
    const slots = await Slot.find({ provider: req.user._id }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
}

async function createSlot(req, res, next) {
  try {
    const { startTime, endTime, title, price } = req.body;

    const slot = await Slot.create({
      provider: req.user._id,
      startTime,
      endTime,
      title: title || "Consultation",
      price: price ?? 0,
      status: "available",
    });

    res.status(201).json({
      success: true,
      message: "Slot created successfully",
      data: slot,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAvailableSlots, getMySlots, createSlot };

