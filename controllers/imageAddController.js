import SimageAdd from "../models/imageAddModel.js";

/**
 * @desc    Get all images
 * @route   GET /api/simage
 * @access  Public / Admin
 */
export const getAllSimages = async (req, res) => {
  try {
    const simages = await SimageAdd.find({});

    return res.status(200).json({
      success: true,
      message: "All images fetched successfully",
      simages,
    });
  } catch (error) {
    console.error("Error fetching images:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Register new image
 * @route   POST /api/simage/register
 * @access  Public
 */
export const registerSimage = async (req, res) => {
  try {
    const { imagelink, imageCategory } = req.body;

    // Basic validation
    if (!imagelink) {
      return res.status(400).json({
        success: false,
        message: "Image link is required",
      });
    }

    // Check existing image
    const existingImage = await SimageAdd.findOne({ imagelink });

    if (existingImage) {
      return res.status(409).json({
        success: false,
        message: "Image already exists",
      });
    }

    // Create new image
    const newImage = await SimageAdd.create({
      imagelink,
      imageCategory,
    });

    return res.status(201).json({
      success: true,
      message: "Image registered successfully",
      image: newImage,
    });
  } catch (error) {
    console.error("Error registering image:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};