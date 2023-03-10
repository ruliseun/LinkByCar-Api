import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import csv from "csv-parser";
import {
  cloudinaryName,
  cloudinaryKey,
  cloudinarySecret,
} from "../../config/env.js";

const fileUpload = multer();

export const uploadBatchVIN = fileUpload.single("vin_batch_file");
export const uploadImage = fileUpload.single("image");

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryKey,
  api_secret: cloudinarySecret,
});

export function validateBatchVINUpload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw" },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    const results = [];

    await new Promise((resolve, reject) => {
      streamifier
        .createReadStream(req.file.buffer)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("error", reject)
        .on("end", resolve);
    });

    const result = await streamUpload(req);
    return result;
  }

  const file = upload(req);
  req.result = file;
  next();
}

export function validateImageUpload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  if (
    !req.file.mimetype.startsWith("image/") ||
    !["image/jpeg", "image/png", "image/jpg"].includes(req.file.mimetype)
  ) {
    return res.status(400).json({
      message: "File uploaded is not a valid image (JPG, JPEG or PNG).",
    });
  }

  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        {
          folder: "profile-images",
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          resource_type: "image",
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    const result = await streamUpload(req);
    return result;
  }

  const file = upload(req);
  req.result = file;
  next();
}
