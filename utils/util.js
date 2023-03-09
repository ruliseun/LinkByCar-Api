import jwt from "jsonwebtoken";

export const generateJWT = (data) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(data, secret, { expiresIn: "100h" });
};
