import Sreview from "../models/reviewModel.js";

/**
 * @desc    Get all Reviews
 * @route   GET /api/review
 * @access  Public / Admin
 */
export const getAllReview = async (req, res) => {
  try {
    const reviews = await Sreview.find({});

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Register new Review
 * @route   POST /api/review/register
 * @access  Public
 */
export const registerReview = async (req, res) => {
  try {
    const { review, swrid } = req.body;

    // Basic validation
    if (!review || !swrid) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Generate custom review ID
    const sreviewid = `SREVIEW-${Date.now()}`;

    // Create new review
    const newReview = await Sreview.create({
      sreviewid,
      review,
      swrid,
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error registering review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
