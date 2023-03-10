import { Router } from "express";
import userController from "../controllers/user/userController.js";
import validate from "../middleware/validators/index.js";
import loginAuth from "../middleware/auth.js";
import {
  userRegistrationValidator,
  loginValidator,
  updateProfileValidator,
  getAllProfile,
} from "../middleware/validators/userValidator.js";
import { validateRequiredID } from "../middleware/validators/commonValidator.js";
import { adminAuth, userAuth } from "../middleware/authenticator.js";
import { uploadImage, validateImageUpload } from "../middleware/uploads.js";

const router = Router();

router.post("/register", userRegistrationValidator, validate, (...args) =>
  userController.register(...args)
);
router.post("/login", loginValidator, validate, (...args) =>
  userController.login(...args)
);
router.put(
  "/update",
  updateProfileValidator,
  validate,
  loginAuth,
  userAuth,
  (...args) => userController.updateProfile(...args)
);
router.get(
  "/profile/:id",
  validateRequiredID("id"),
  validate,
  loginAuth,
  userAuth,
  (...args) => userController.getProfile(...args)
);
router.get("/profile", getAllProfile, validate, (...args) =>
  userController.getAllProfile(...args)
);
router.delete(
  "/delete/:id",
  validateRequiredID("id"),
  validate,
  loginAuth,
  adminAuth,
  (...args) => userController.deleteProfile(...args)
);
router.put(
  "/profile-image-upload/:id",
  validateRequiredID("id"),
  validate,
  loginAuth,
  userAuth,
  uploadImage,
  validateImageUpload,
  (...args) => userController.uploadProfileImage(...args)
);

export default router;
