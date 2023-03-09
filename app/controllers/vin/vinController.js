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
      AbstractController.errorResponse(
        res,
        "Error validating vin",
        error.httpStatusCode,
        error
      );
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
      AbstractController.errorResponse(
        res,
        "Error validating vin",
        error.httpStatusCode,
        error
      );
    }
  }
}

export default new VinController();
