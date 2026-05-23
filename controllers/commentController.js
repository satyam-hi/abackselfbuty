import Scomment from "../models/commentModel.js";

/**
 * @desc    Get all Comments
 * @route   GET /api/comment
 * @access  Public / Admin
 */
export const getAllComment = async (req, res) => {
  try {
    const comments = await Scomment.find({});
    return res.status(200).json({
      success: true,
      message: "All comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Register new Comment
 * @route   POST /api/comment/register
 * @access  Public
 */
export const registerComment = async (req, res) => {
  try {
    const { comment, swrid } = req.body;

    // Basic validation
    if (!comment || !swrid) {
      return res.status(400).json({
        success: false,
        message: "Comment and swrid are required",
      });
    }

    // Generate custom comment ID
    const scommentid = `SCOMMENT-${Date.now()}`;

    // Create and save new comment
    const newComment = await Scomment.create({
      scommentid,
      comment,
      swrid,
    });

    const commentResponse = newComment.toObject();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: commentResponse,
    });
  } catch (error) {
    console.error("Error registering comment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
