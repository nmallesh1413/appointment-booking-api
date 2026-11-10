const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
      index: true,
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      default: 0,
    },
  },
  { timestamps: true }
);

slotSchema.pre("validate", function validateSlot(next) {
  if (this.startTime && this.endTime && new Date(this.endTime) <= new Date(this.startTime)) {
    this.invalidate("endTime", "End time must be after start time");
  }
  next();
});

slotSchema.index({ provider: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model("Slot", slotSchema);

