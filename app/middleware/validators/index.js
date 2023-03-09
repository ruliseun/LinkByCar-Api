import { validationResult } from "express-validator";

export default function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = {};

  errors.array().forEach(({ param, msg }) => {
    extractedErrors[param] = msg;
  });

  return res.status(400).json({
    status: "Failed",
    message: JSON.stringify(Object.values(extractedErrors)),
    errors: extractedErrors,
  });
}
