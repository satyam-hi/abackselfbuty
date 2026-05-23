import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    scommentid: { type: String, required: true },
    comment: { type: String, required: true },
    swrid: { type: String, required: true },
  },
  { timestamps: true }
);

const Scomment = mongoose.model("Scomment", commentSchema);
export default Scomment;
