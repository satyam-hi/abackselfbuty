// models/userModel.js
import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema(
  {
    ssrvcid: { type: String, required: true },
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Sservices = mongoose.model("Sservices", servicesSchema);
export default Sservices;
