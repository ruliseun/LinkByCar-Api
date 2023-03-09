import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
import userModel from "../models/user/userModel.js";

export default async function loginAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        error: "Please sign in",
      });
    }
    const token = authorization?.slice(7, authorization.length);

    let verified = jwt.verify(token, secret);

    if (!verified) {
      return res.status(401).json({
        error: "User not verified, access denied",
      });
    }

    const { _id } = verified;

    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(404).json({
        error: "User not verified",
      });
    }
    req.user = _id;
    next();
  } catch (error) {
    res.status(403).json({ error: "User not logged in" });
    throw new Error(`${error}`);
  }
}
