import dotenv from "dotenv";

dotenv.config();

export const nodeEnv = process.env.NODE_ENV;

// APP URL
export const baseApiURL = process.env.BASE_API_URL;

// BCRYPT
export const bcryptSalt = parseInt(process.env.BCRYPT_SALT, 10);

// JWT
export const jwtSecret = process.env.JWT_SECRET;

// MONGO
export const mongoURI = process.env.MONGO_URI;

// CLOUDINARY
export const cloudinaryName = process.env.CLOUD_NAME;
export const cloudinaryKey = process.env.API_KEY;
export const cloudinarySecret = process.env.API_SECRET;

(() => {
  const requiredEnvs = {
    nodeEnv,
    bcryptSalt,
    jwtSecret,
    mongoURI,
    baseApiURL,
    cloudinaryName,
    cloudinaryKey,
    cloudinarySecret,
  };
  console.log("running env check", requiredEnvs);

  const missing = Object.keys(requiredEnvs)
    .map((variable) => {
      if (!requiredEnvs[variable]) return variable;
      return "";
    })
    .filter((val) => val.length);

  if (missing.length) console.error("[MISSING ENV VARIABLES]:\n", missing);
})();
