import jwt from "jsonwebtoken";
import Sprovider from "../models/providerModel.js";

export const providerAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, "SECRET_KEY");
    const sprovid = decoded.id; // provider id stored in JWT

    // Find provider
    const provider = await Sprovider.findOne({ sprovid });

    if (!provider || provider.accesstoken !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.provider = decoded; // attach provider data to request
    next();
  } catch (error) {
    console.log("Provider Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
