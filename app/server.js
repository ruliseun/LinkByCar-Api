import express from "express";
import dbConfig from "../config/database.js";

import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import initializeRoutes from "./routes/index.js";

import { ServerApiVersion } from "mongodb";

function connectDb() {
  mongoose.Promise = global.Promise;
  console.log("DB URL", dbConfig.url);

  mongoose
    .connect(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    })
    .then(() => {
      console.log("\n[MONGO]: Successfully connected to the database");
    })
    .catch((err) => {
      console.log(
        `\n[MONGO]: Could not connect to the database\n${err}\nExiting now...`
      );
      process.exit();
    });

  // mongoose.set("useCreateIndex", true);
  // mongoose.set("useFindAndModify", false);
  // mongoose.set("debug", false);
}

export default function setupServer() {
  const app = express();

  connectDb();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  initializeRoutes(app);

  const httpServer = createServer();
  httpServer.on("request", app);

  return { httpServer };
}
