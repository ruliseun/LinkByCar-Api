import { Router } from "express";
import validate from "../middleware/validators/index.js";
import {
  createRoleValidator,
  validateID,
  validateRoleUpdate,
} from "../middleware/validators/rolesValidator.js";
import rolesController from "../controllers/roles/roleController.js";
import { adminAuth } from "../middleware/authenticator.js";
import loginAuth from "../middleware/auth.js";

const router = Router();

router.post(
  "/create",
  loginAuth,
  adminAuth,
  createRoleValidator,
  validate,
  (...args) => rolesController.create(...args)
);

router.get("/get", (...args) => rolesController.getRoles(...args));

router.get("/get/:id", validateID, validate, (...args) =>
  rolesController.getRoleById(...args)
);

router.put(
  "/update/:id",
  loginAuth,
  adminAuth,
  validateRoleUpdate,
  validate,
  (...args) => rolesController.updateRole(...args)
);

router.delete(
  "/delete/:id",
  loginAuth,
  adminAuth,
  validateID,
  validate,
  (...args) => rolesController.deleteRole(...args)
);

export default router;
