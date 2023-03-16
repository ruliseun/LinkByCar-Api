import { check } from "express-validator";

export const vinValidation = [
  check("vin").notEmpty().isString().withMessage("Vin is required").trim(),
];

export const getVinValidation = [
  check("vin").notEmpty().isString().withMessage("Vin must be a string").trim(),
  check("country")
    .notEmpty()
    .isString()
    .withMessage("Country must be a string")
    .trim(),
];
