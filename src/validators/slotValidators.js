const { body, param } = require("express-validator");

const createSlotRules = [
  body("startTime").isISO8601().withMessage("Start time must be a valid ISO 8601 date"),
  body("endTime").isISO8601().withMessage("End time must be a valid ISO 8601 date"),
  body("startTime").custom((value) => {
    if (new Date(value) <= new Date()) {
      throw new Error("Start time must be in the future");
    }
    return true;
  }),
  body("endTime").custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.startTime)) {
      throw new Error("End time must be after start time");
    }
    return true;
  }),
  body("title").optional().trim().isLength({ min: 2, max: 120 }).withMessage("Title must be between 2 and 120 characters"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
];

const slotIdRules = [
  param("id").isMongoId().withMessage("Invalid slot ID"),
];

module.exports = { createSlotRules, slotIdRules };

