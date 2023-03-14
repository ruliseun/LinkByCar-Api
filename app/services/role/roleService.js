import AbstractService from "../AbstractService.js";
import roleModel from "../../models/role/roleModel.js";

class RoleService extends AbstractService {
  constructor() {
    super();
    this.roleModel = roleModel;
  }

  /**
   *
   */
  async createRole(roleInfo) {
    const { name } = roleInfo;
    const matchQuery = {
      $or: [{ name: name.toLowerCase() }],
    };

    const roleExists = await this.roleModel.findOne(matchQuery);

    if (roleExists) {
      const error = new Error("A role with that name already exists");
      error.httpStatusCode = 409;
      throw error;
    }

    const role = await AbstractService.create(this.roleModel, roleInfo);

    return role;
  }

  async getAllRoles() {
    const roles = await this.roleModel.find();
    return roles;
  }

  async getRoleById(roleId) {
    const { id } = roleId;
    const role = await AbstractService.getDocumentById(this.roleModel, id);
    return role;
  }

  async updateRole(roleInfo) {
    const { id, name, permissions } = roleInfo;

    const userRole = await this.roleModel.findById(id);
    if (!userRole) {
      return {
        error: "Role does not exist",
        data: null,
      };
    }

    if (userRole.permissions.includes(permissions.toLowerCase())) {
      const error = new Error("Permission already exists");
      error.httpStatusCode = 409;
      throw error;
    }

    userRole.name = name;
    userRole.permissions.push(permissions.toLowerCase());

    const updatedRecord = await userRole.save();

    return {
      message: "Role updated successfully",
      data: updatedRecord,
    };
  }

  async deleteRole(roleInfo) {
    const { id } = roleInfo;
    await AbstractService.deleteDocumentById(this.roleModel, id);
    return;
  }
}

export default new RoleService();
