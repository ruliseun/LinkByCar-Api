import mongoose from "mongoose";

const VinRecordSchema = new mongoose.Schema(
  {
    reg_or_vin: {
      type: String,
      required: true,
    },
    vin: {
      type: String,
      required: true,
    },
    reg_plate: {
      type: String,
      required: true,
    },
    car_identification: {
      type: Object,
      required: true,
    },
    registration_info: {
      type: Object,
      required: true,
    },

    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: {
      currentTime: () => new Date().valueOf().toString(),
    },
  }
);

export default mongoose.model("Vinrecord", VinRecordSchema);
