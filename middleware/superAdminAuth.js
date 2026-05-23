import Ssuperadmin from "../models/superAminModel.js";

export const SuperAdminAuthMiddleware = async (req, res, next) => {
  try {
    const adminCode = req.headers.authorization;

    if (!adminCode) {
      return res.status(401).json({
        success: false,
        message: "No adminCode provided",
      });
    }

    // direct match (no need to re-check again)
    const admin = await Ssuperadmin.findOne({ adminCode });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid adminCode",
      });
    }

    req.admin = admin; // optional but useful
    next();
  } catch (error) {
    console.log("admin Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};