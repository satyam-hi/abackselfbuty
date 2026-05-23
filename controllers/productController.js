import Product from "../models/productModel.js";


// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      sprovid,
      spcategoryid,
      sptypeid,
      sptypename,
      spcategoryname,
      imagelink
    } = req.body;

    // // IMAGE
    // const image = req.file
    //   ? `/uploads/${req.file.filename}`
    //   : "";
     const image = "";

    // VALIDATION
    if (
      !name ||
      !description ||
      !price ||
      !sprovid ||
      !spcategoryid ||
      !sptypeid
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // PRODUCT ID
    const sproductid = `SPRODUCT-${Date.now()}`;

    // CREATE
    const product = await Product.create({
      sproductid,
      name,
      description,
      price,
      image,
      sprovid,
      spcategoryid,
      sptypeid,
      sptypename,
      spcategoryname,
      imagelink
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {

    const {
      sprovid,
      spcategoryid,
      sptypeid,
      search,
      page = 1,
      limit = 2,
    } = req.query;

    // FILTER
    const filter = {
      isAvailable: true,
    };

    if (sprovid) {
      filter.sprovid = sprovid;
    }

    if (spcategoryid) {
      filter.spcategoryid = spcategoryid;
    }

    if (sptypeid) {
      filter.sptypeid = sptypeid;
    }

    // SEARCH
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // PAGINATION
    const skip = (page - 1) * limit;

    // QUERY
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // TOTAL
    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {

    // NEW IMAGE
    // if (req.file) {
    //   req.body.image = `/uploads/${req.file.filename}`;
    // }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// PROVIDER PRODUCTS
export const getAllProviderProducts = async (req, res) => {
  try {

    const { spprovid } = req.query;

    if (!spprovid) {
      return res.status(400).json({
        success: false,
        message: "Provider ID required",
      });
    }

    const products = await Product.find({
      sprovid: spprovid,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: products.length,
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// ==========================================================================
// import Product from "../models/productModel.js";

// // export const createProduct = async (req, res) => {
// //   try {
// //     const product = await Product.create(req.body);

// //     res.status(201).json(product);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // export const createProduct = async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       description,
// //       price,
// //       image,
// //       sprovid,
// //       spcategoryid,
// //       sptypeid,
// //       sptypename,
// //       spcategoryname,
// //       isAvailable,
// //     } = req.body;

// //     // Basic validation
// //     if (
// //       !name ||
// //       !description ||
// //       !price ||
// //       !sprovid ||
// //       !spcategoryid ||
// //       !sptypeid ||
// //       !sptypename ||
// //       !spcategoryname
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "All fields are required",
// //       });
// //     }

// //     // Generate custom product ID
// //     const sproductid = `SPRODUCT-${Date.now()}`;

// //     // Create new product
// //     const product = await Product.create({
// //       sproductid,
// //       name,
// //       description,
// //       price,
// //       image,
// //       sprovid,
// //       spcategoryid,
// //       sptypeid,
// //       sptypename,
// //       spcategoryname,
// //       isAvailable,
// //     });

// //     // Convert to object if needed
// //     const productResponse = product.toObject();

// //     return res.status(201).json({
// //       success: true,
// //       message: "Product created successfully",
// //       product: productResponse,
// //     });
// //   } catch (error) {
// //     console.error("Error creating product:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: "Internal Server Error",
// //       error: error.message,
// //     });
// //   }
// // };

// export const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       sprovid,
//       spcategoryid,
//       sptypeid,
//       sptypename,
//       spcategoryname,
//     } = req.body;

//     // Uploaded image path
//     const image = req.file
//       ? `/uploads/${req.file.filename}`
//       : "";

//     // Validation
//     if (
//       !name ||
//       !description ||
//       !price ||
//       !sprovid
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields missing",
//       });
//     }

//     // Generate custom product ID
//     const sproductid = `SPRODUCT-${Date.now()}`;

//     // Save product
//     const product = await Product.create({
//       sproductid,
//       name,
//       description,
//       price,
//       image,
//       sprovid,
//       spcategoryid,
//       sptypeid,
//       sptypename,
//       spcategoryname,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();

//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getSingleProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const deleteProduct = async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);

//     res.json({ message: "Product deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// export const getAllProviderProducts = async (req, res) => {
//   try {
//     const { spprovid } = req.query;
  

//     const products = await Product.find({
//       sprovid: spprovid,
//     });

//     return res.status(200).json({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // export const getAllProviderProducts = async (req, res) => {
// //   try {
// //     const { spprovid } = req.query;

// //     const filter = {};
// //     if (spprovid) {
// //       filter.sprovid = spprovid;
// //     }

// //     const products = await Product.find(filter);

// //     res.json({
// //       success: true,
// //       products,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

