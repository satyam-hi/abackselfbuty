import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sproductid: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },
    imagelink: {
      type: String,
      default: "",
    },

    sprovid: {
      type: String,
      required: true,
    },

    spcategoryid: {
      type: String,
      required: true,
    },

    sptypeid: {
      type: String,
      required: true,
    },

    sptypename: {
      type: String,
      required: true,
    },

    spcategoryname: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;










// // models/userModel.js
// import mongoose from "mongoose";

// const SproductSchema = new mongoose.Schema(
//   {
//     sproductid: { type: String, required: true },
//     name: { type: String, required: true },
//     descripton: { type: String, required: true},
//     price: { type: String, required: true},
//     sprovid: { type: String, required: true},
//     spcategoryid: { type: String, required: true},
//     sptypeid: { type: String, required: true},
//     sptypename: { type: String, required: true},
//     spcategoryname: { type: String, required: true},
//   },
//   { timestamps: true }
// );

// const Sproduct = mongoose.model("Sproduct", SproductSchema);
// export default Sproduct;
