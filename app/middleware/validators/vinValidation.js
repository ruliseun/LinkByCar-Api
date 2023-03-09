import { check } from "express-validator";

export const vinValidation = [
  check("vin").notEmpty().isString().withMessage("Vin is required").trim(),
];
