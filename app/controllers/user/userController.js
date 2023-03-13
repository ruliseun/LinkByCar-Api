import { matchedData } from "express-validator";
import AbstractController from "../AbstractController.js";
import userService from "../../services/user/userService.js";

class UserController extends AbstractController {
  constructor() {
    super();
    this.userService = userService;
  }

  /**
   *
   */
  async register(req, res) {
    const userInfo = matchedData(req);
    try {
      const userData = await this.userService.registerUser(userInfo);
      if (!userData) {
        return res.status(500).json({ message: "Error registering user" });
      }
      AbstractController.successResponse(
        res,
        { ...userData },
        "User registered successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error registering user",
        error.httpStatusCode,
        error
      );
    }
  }

  /**
   *
   */
  async login(req, res) {
    const userInfo = matchedData(req);
    try {
      const user = await this.userService.loginUser(userInfo);
      if (!user) {
        return res.status(500).json({ message: "Error logging in user" });
      }
      AbstractController.successResponse(
        res,
        { user },
        "User logged in successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error logging in user",
        error,
        error.httpStatusCode
      );
    }
  }

  /**
   *
   */
  async updateProfile(req, res) {
    const userInfo = matchedData(req);
    if (Object.keys(userInfo).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }
    userInfo.id = req.user;
    try {
      const user = await this.userService.updateProfile(userInfo);
      if (!user) {
        return res.status(500).json({ message: "Error updating user profile" });
      }
      AbstractController.successResponse(
        res,
        { user },
        "User profile updated successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      return res.status(500).json({
        message: "Error updating user profile",
        error: error?.message,
      });
    }
  }

  /**
   *
   */
  async getProfile(req, res) {
    const userInfo = matchedData(req);
    try {
      const user = await this.userService.getProfile(userInfo);
      if (!user) {
        return res.status(500).json({ message: "Error getting user profile" });
      }
      AbstractController.successResponse(
        res,
        { user },
        "User profile fetched successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error getting user profile",
        error.httpStatusCode,
        error
      );
    }
  }

  /**
   *
   */
  async getAllProfile(req, res) {
    const { page } = matchedData(req);

    const filter = {
      page: +page || 1,
    };

    try {
      const users = await this.userService.getAllProfile(filter);
      if (!users) {
        return res.status(500).json({ message: "Error getting user profile" });
      }
      AbstractController.successResponse(
        res,
        { ...users },
        "User profile fetched successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error getting user profile",
        error.httpStatusCode,
        error
      );
    }
  }

  /**
   *
   */
  async deleteProfile(req, res) {
    const { id } = matchedData(req);
    try {
      const user = await this.userService.deleteProfile(id);
      AbstractController.successResponse(
        res,
        { ...user },
        "User profile deleted successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error deleting user profile",
        error.httpStatusCode,
        error
      );
    }
  }

  async uploadProfileImage(req, res) {
    const userData = matchedData(req);
    const payload = {
      ...userData,
      image_file: await req.result,
    };

    try {
      const user = await this.userService.uploadProfileImage(payload);
      AbstractController.successResponse(
        res,
        { user },
        "User profile image uploaded successfully"
      );
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(
        res,
        "Error uploading user profile image",
        error.httpStatusCode,
        error
      );
    }
  }
}

export default new UserController();
