import { check } from "express-validator";

export const validateRequiredID = (key) => [
  check(key)
    .exists()
    .isMongoId()
    .withMessage(`${key} is required`)
    .isString()
    .trim(),
];
