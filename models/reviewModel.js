// models/reviewModel.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    sreviewid: { type: String, required: true },
    review: { type: String, required: true },
    swrid: { type: String, required: true },
  },
  { timestamps: true }
);

const Sreview = mongoose.model("Sreview", reviewSchema);
export default Sreview;
