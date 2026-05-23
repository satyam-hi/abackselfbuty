// models/userModel.js
import mongoose from "mongoose";

const localAriaSchema = new mongoose.Schema(
  {
    sloctyid: { type: String, required: true },
    sctyid: { type: String, required: true },
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const SlocalAria = mongoose.model("SlocalAria", localAriaSchema);
export default SlocalAria;
