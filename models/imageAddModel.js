// models/userModel.js
import mongoose from "mongoose";

const SimageAddSchema = new mongoose.Schema(
  {
    imagelink: { type: String, required: true, unique: true },
    imageCategory:String
  },
  { timestamps: true }
);

const SimageAdd = mongoose.model("SimageAdd", SimageAddSchema);
export default SimageAdd;
