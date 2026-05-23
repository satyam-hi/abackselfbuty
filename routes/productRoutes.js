import express from "express";
// import upload from "../middleware/uploadMiddleware.js";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getAllProviderProducts,
} from "../controllers/productController.js";

const productRouter = express.Router();


// PROVIDER PRODUCTS
productRouter.get(
  "/provider-products",
  getAllProviderProducts
);


// ALL PRODUCTS
productRouter.get("/", getProducts);


// SINGLE PRODUCT
productRouter.get("/:id", getSingleProduct);


// CREATE
productRouter.post(
  "/create",
  createProduct
);
// router.post(
//   "/create",
//   // upload.single("image"),
//   createProduct
// );


// UPDATE
productRouter.put(
  "/:id",
  updateProduct
);


// DELETE
productRouter.delete("/:id", deleteProduct);

export default productRouter;

// =======================================

// import express from "express";
// import upload from "../middleware/uploadMiddleware.js";

// import {
//   createProduct,
//   getProducts,
//   getSingleProduct,
//   updateProduct,
//   deleteProduct,
//   getAllProviderProducts
// } from "../controllers/productController.js";

// const productRouter = express.Router();

// productRouter.post("/", upload.single("image"), createProduct);

// productRouter.get("/", getProducts);
// productRouter.get("/provider-products", getAllProviderProducts);

// productRouter.get("/:id", getSingleProduct);

// productRouter.put("/:id", updateProduct);

// productRouter.delete("/:id", deleteProduct);

// export default productRouter;