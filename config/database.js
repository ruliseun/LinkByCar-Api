import dotenv from "dotenv";
dotenv.config();

console.log(process.env.MONGO_URI);
let url;

switch (process.env.NODE_ENV) {
  case "development":
    url = process.env.MONGO_URI;
    break;
  case "production":
    url = "";
    break;
}

export default { url };
