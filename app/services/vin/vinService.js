import AbstractService from "../AbstractService.js";
import axios from "axios";
import csvR from "csvtojson";
import vinRecordModel from "../../models/vin/vinRecordModel.js";

const baseURL = "https://api.linkbycar.com/v1/eligibility/vin";

class VinService extends AbstractService {
  constructor() {
    super();
    this.vinRecordModel = vinRecordModel;
  }

  async validateVin(data) {
    const { vin } = data;
    const validateVIN = await axios.get(`${baseURL}/${vin}`, {
      headers: {
        authorization: `Bearer ${process.env.LINKBYCAR_API_KEY}`,
      },
    });

    if (validateVIN.status === 200) {
      return {
        data: validateVIN.data,
        message: "VIN Validated Successfully",
      };
    }

    return {
      message: "Error Validating VIN",
      status: validateVIN.response.status,
      data: validateVIN.response.data,
    };
  }

  async batchValidateVin(data, req, res) {
    const { file } = data;
    const uploadedVins = [];

    const csvData = await axios.get(file.secure_url);

    csvR()
      .fromString(csvData.data)
      .then(async (jsonObj) => {
        const vins = jsonObj;
        await Promise.all(
          vins.map(async (vin) => {
            if (vin.VIN.length !== 17) {
              return res.status(400).json({
                message: "Invalid VIN",
                error: "VIN must be 17 characters long",
              });
            }
            const result = await this.validateVin({ vin: vin.VIN });
            const report = {
              vin: vin.VIN,
              manufacturer: result.manufacturer,
              vehicle_eligibility_status: result.vehicle_eligibility_status,
              comment: result.comment,
              data: result.data,
            };
            uploadedVins.push(report);
          })
        );
        return res.status(200).json({
          message: "VINs validated successfully",
          data: uploadedVins,
        });
      })
      .catch((err) => {
        console.log("ERR", err);
        return res.status(500).json({
          message: "Error validating VINs",
          error: err?.response?.data?.detail,
        });
      });
  }

  async getVinData(data) {
    const { vin, country } = data;
    const autoPassBaseURL = "https://api.autopass.pro";

    const matchedQuery = {
      $or: [
        { reg_or_vin: vin },
        { vin: vin.toUpperCase() },
        { reg_plate: vin.toUpperCase() },
        { vin: vin },
      ],
    };

    const matchedVin = await this.vinRecordModel.findOne(matchedQuery);
    if (matchedVin) return matchedVin;

    const response = await axios.get(
      `${autoPassBaseURL}/vehicle?reg_or_vin=${vin}&reg_country=${country}&access_token=${process.env.AUTOPASS_ACCESS_TOKEN}`
    );
    if (response.status === 200) {
      const vinData = {
        reg_or_vin: response.data.reg_or_vin,
        vin: response.data.car_identification.vin,
        reg_plate: response.data.car_identification.reg_plate,
        car_identification: response.data.car_identification,
        registration_info: response.data.registration_info,
      };
      const vinRecord = await AbstractService.create(
        this.vinRecordModel,
        vinData
      );
      return {
        data: vinRecord,
        message: "VIN Data Retrieved Successfully",
      };
    }
  }

  async batchVinData(data, req, res) {
    const { file, country } = data;
    const uploadedVins = [];
    const autoPassBaseURL = "https://api.autopass.pro";

    const csvData = await axios.get(file.secure_url);

    csvR()
      .fromString(csvData.data)
      .then(async (jsonObj) => {
        const vins = jsonObj;
        await Promise.all(
          vins.map(async (vin) => {
            if (vin.reg_or_vin.length < 9) {
              return res.status(400).json({
                message: "Invalid reg_or_vin",
                error: "reg_or_vin must be atleast 9 characters long",
              });
            }

            const matchedQuery = {
              $or: [
                { reg_or_vin: vin.reg_or_vin },
                { vin: vin.reg_or_vin.toUpperCase() },
                { reg_plate: vin.reg_or_vin.toUpperCase() },
                { vin: vin.reg_or_vin },
              ],
            };
            const matchedVin = await this.vinRecordModel.findOne(matchedQuery);
            if (matchedVin) {
              uploadedVins.push(matchedVin.reg_or_vin);
            } else {
              const reg_or_vin = vin.reg_or_vin;
              const response = axios.get(
                `${autoPassBaseURL}/vehicle?reg_or_vin=${reg_or_vin}&reg_country=${country}&access_token=${process.env.AUTOPASS_ACCESS_TOKEN}`
              );
              if (response.status === 200) {
                const vinData = {
                  reg_or_vin: response.data.reg_or_vin,
                  vin: response.data.car_identification.vin,
                  reg_plate: response.data.car_identification.reg_plate,
                  car_identification: response.data.car_identification,
                  registration_info: response.data.registration_info,
                };
                await AbstractService.create(this.vinRecordModel, vinData);
                uploadedVins.push(response.data.reg_or_vin);
              }
            }
          })
        );
        return res.status(200).json({
          message: "VINs data retrieved successfully",
          data: uploadedVins,
        });
      })
      .catch((err) => {
        console.log("ERR", err);
        return res.status(500).json({
          message: "Error retrieving VIN data",
          error: err?.response?.data?.detail,
        });
      });
  }
}

export default new VinService();
