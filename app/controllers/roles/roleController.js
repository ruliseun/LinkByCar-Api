import { matchedData } from "express-validator";
import AbstractController from "../AbstractController.js";
import roleService from "../../services/role/roleService.js";

class RolesController extends AbstractController {
  constructor() {
    super();
    this.roleService = roleService;
  }

  /**
   *
   */
  async create(req, res) {
    const roleInfo = matchedData(req);
    try {
      const role = await this.roleService.createRole(roleInfo);
      if (!role) {
        return res.status(500).json({ message: "Error creating role" });
      }
      AbstractController.successResponse(
        res,
        { role },
        "Role created successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error creating role",
        error.httpStatusCode,
        error
      );
    }
  }

  async getRoles(req, res) {
    try {
      const roles = await this.roleService.getAllRoles();
      if (!roles) {
        return res.status(500).json({ message: "Error getting roles" });
      }
      AbstractController.successResponse(
        res,
        { roles },
        "Roles retrieved successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error getting roles",
        error.httpStatusCode,
        error
      );
    }
  }

  async getRoleById(req, res) {
    const data = matchedData(req);
    try {
      const role = await this.roleService.getRoleById(data);
      AbstractController.successResponse(
        res,
        { role },
        "Role retrieved successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error getting role",
        error.httpStatusCode,
        error
      );
    }
  }

  async updateRole(req, res) {
    const data = matchedData(req);
    try {
      const role = await this.roleService.updateRole(data);
      AbstractController.successResponse(
        res,
        { role },
        "Role updated successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error updating role",
        error.httpStatusCode,
        error
      );
    }
  }

  async deleteRole(req, res) {
    const data = matchedData(req);
    try {
      const role = await this.roleService.deleteRole(data);
      AbstractController.successResponse(
        res,
        { role },
        "Role deleted successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error deleting role",
        error.httpStatusCode,
        error
      );
    }
  }
}

export default new RolesController();
