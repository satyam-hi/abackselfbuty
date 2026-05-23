// models/userModel.js
import mongoose from "mongoose";

const SproductTypeSchema = new mongoose.Schema(
  {
    sptypeid: { type: String, required: true },
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const SproductType = mongoose.model("SproductType", SproductTypeSchema);
export default SproductType;
