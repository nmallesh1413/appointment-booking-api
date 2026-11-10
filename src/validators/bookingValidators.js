const { body, param } = require("express-validator");

const bookSlotRules = [
  body("slotId").isMongoId().withMessage("Invalid slot ID"),
];

const bookingIdRules = [
  param("id").isMongoId().withMessage("Invalid booking ID"),
];

module.exports = { bookSlotRules, bookingIdRules };

