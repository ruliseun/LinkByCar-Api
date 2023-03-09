import usersRoute from "./usersRoute.js";
import rolesRoute from "./rolesRoute.js";
import vinRoute from "./vinRoute.js";

export default function initializeRoutes(app) {
  app.use("/api/v1/users", usersRoute);
  app.use("/api/v1/roles", rolesRoute);
  app.use("/api/v1/vin", vinRoute);
}
