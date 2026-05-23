// models/userModel.js
import mongoose from "mongoose";

const SproductCategorySchema = new mongoose.Schema(
  {
    spcategoryid: { type: String, required: true },
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const SproductCategory = mongoose.model("SproductCategory", SproductCategorySchema);
export default SproductCategory;
