import AbstractService from "../AbstractService.js";
import axios from "axios";
import csvR from "csvtojson";

const baseURL = "https://api.linkbycar.com/v1/eligibility/vin";

class VinService extends AbstractService {
  constructor() {
    super();
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
}

export default new VinService();
