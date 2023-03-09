import { Router } from "express";
import vinController from "../controllers/vin/vinController.js";
import {
  uploadBatchVIN,
  validateBatchVINUpload,
} from "../middleware/uploads.js";
import validate from "../middleware/validators/index.js";
import { vinValidation } from "../middleware/validators/vinValidation.js";
import { adminAuth } from "../middleware/authenticator.js";
import loginAuth from "../middleware/auth.js";

const router = Router();

router.get(
  "/validate",
  vinValidation,
  validate,
  loginAuth,
  adminAuth,
  (...args) => vinController.validateVin(...args)
);

router.post(
  "/batch_validate",
  loginAuth,
  adminAuth,
  uploadBatchVIN,
  validateBatchVINUpload,
  (...args) => vinController.batchValidateVin(...args)
);

export default router;
