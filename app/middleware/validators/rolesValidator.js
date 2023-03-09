import { check } from "express-validator";

export const createRoleValidator = [
  check("name").notEmpty().isString().withMessage("Name is required").trim(),
  check("permissions")
    .notEmpty()
    .isArray()
    .withMessage("Permissions is required")
    .trim(),
];

export const validateID = [
  check("id").notEmpty().isMongoId().withMessage("ID is required").trim(),
];

export const validateRoleUpdate = [
  check("id").notEmpty().isMongoId().withMessage("ID is required").trim(),
  check("name").optional().isString().withMessage("Name is required").trim(),
  check("permissions")
    .optional()
    .isString()
    .withMessage("Permissions is required")
    .trim(),
];
