import mongoose from "mongoose";
import userModel from "../models/user/userModel.js";

export async function adminAuth(req, res, next) {
  const user = req.user;

  console.log("user", user);

  const userCredentials = await userModel
    .findById(new mongoose.Types.ObjectId(user))
    .populate("role");

  if (
    !(
      userCredentials.role.permissions.includes("write") &&
      userCredentials.role.permissions.includes("read")
    )
  ) {
    return res.status(403).json({
      error: "User does not have the necessary permissions",
    });
  }

  next();
}

export async function userAuth(req, res, next) {
  const user = req.user;

  const userCredentials = await userModel
    .findById(new mongoose.Types.ObjectId(user))
    .populate("role");

  if (!userCredentials.role.permissions.includes("read")) {
    return res.status(403).json({
      error: "User does not have the necessary permissions",
    });
  }

  next();
}
