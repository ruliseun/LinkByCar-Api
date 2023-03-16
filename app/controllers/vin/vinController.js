import { matchedData } from "express-validator";
import AbstractController from "../AbstractController.js";
import vinService from "../../services/vin/vinService.js";

class VinController extends AbstractController {
  constructor() {
    super();
    this.vinService = vinService;
  }

  /**
   *
   */
  async validateVin(req, res) {
    const data = matchedData(req);
    try {
      const result = await this.vinService.validateVin(data);
      AbstractController.successResponse(res, { ...result }, "Vin validated");
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(res, error.httpStatusCode, error);
    }
  }

  async batchValidateVin(req, res) {
    const data = matchedData(req);
    const file = await Promise.resolve(req.result);
    const uploadData = {
      ...data,
      file,
    };
    try {
      await this.vinService.batchValidateVin(uploadData, req, res);
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(res, error.httpStatusCode, error);
    }
  }

  async getVinData(req, res) {
    const data = matchedData(req);
    try {
      const result = await this.vinService.getVinData(data);
      AbstractController.successResponse(
        res,
        { ...result },
        "Vin data retrieved"
      );
    } catch (error) {
      console.log("ERR", error);
      // AbstractController.errorResponse(res, error.httpStatusCode, error);
      return res.status(500).json({
        message: "Error validating VINs",
        data: null,
        status: error?.response?.status,
        error: error?.response?.data?.detail,
      });
    }
  }

  async batchVinData(req, res) {
    const data = matchedData(req);
    const country = req.body.country;
    const file = await Promise.resolve(req.result);
    const uploadData = {
      ...data,
      country,
      file,
    };
    try {
      await this.vinService.batchVinData(uploadData, req, res);
    } catch (error) {
      console.log("ERR", error);
      AbstractController.errorResponse(res, error.httpStatusCode, error);
    }
  }
}

export default new VinController();
