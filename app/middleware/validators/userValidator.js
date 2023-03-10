import { check } from "express-validator";

export const userRegistrationValidator = [
  check("name").notEmpty().isString().withMessage("Name is required").trim(),
  check("email").notEmpty().isEmail().withMessage("Email is required").trim(),
  check("password")
    .notEmpty()
    .isString()
    .withMessage("Password is required")
    .trim(),
  check("username")
    .notEmpty()
    .isString()
    .withMessage("Username is required")
    .trim(),
  check("gender")
    .notEmpty()
    .isString()
    .withMessage("Gender is required")
    .trim(),
  check("email_verified").optional({ nullable: true }).isBoolean(),
  check("profile_image").optional({ nullable: true }),
  check("phone_no")
    .notEmpty()
    .isString()
    .withMessage("Phone number is required")
    .trim(),
  check("role")
    .optional({ nullable: true })
    .isString()
    .withMessage("Invalid Format for role"),
];

export const updateProfileValidator = [
  check("name").isString().optional().trim(),
  check("password").isString().optional().trim(),
  check("username").isString().optional().trim(),
  check("gender").isString().optional().trim(),
  check("email_verified").optional().isBoolean(),
  check("profile_image").optional(),
  check("email_verified").isString().optional().trim(),
  check("role").optional().isString().withMessage("Invalid Format for role"),
];

export const getAllProfile = [
  check("page").isInt().optional({ nullable: true }).trim(),
];

export const loginValidator = [
  check("email").isEmail().optional({ nullable: true }).trim(),
  check("password")
    .notEmpty()
    .isString()
    .withMessage("Password is required")
    .trim(),
  check("username").isString().optional({ nullable: true }).trim(),
];
