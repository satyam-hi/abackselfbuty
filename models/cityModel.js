// models/userModel.js
import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    sctyid: { type: String, required: true },
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Scity = mongoose.model("Scity", citySchema);
export default Scity;
