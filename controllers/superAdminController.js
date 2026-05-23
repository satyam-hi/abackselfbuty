// import Suser from "../models/suserModel.js";
import Ssuperadmin from "../models/superAminModel.js";
// import jwt from "jsonwebtoken";


// import { sendEmail } from "../utils/sendEmail.js"

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public / Admin
 */
export const getAllAdmin = async (req, res) => {
    try {
        // const users = await Suser.find({}, "-password"); // exclude password field
        const users = await Ssuperadmin.find({}); // include password field
        // Ssuperadmin.find({}, "-adminCode");
        return res.status(200).json({
            success: true,
            message: "All admin fetched successfully",
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Register new user
 * @route   POST /api/users/register
 * @access  Public
 */

export const registerAdmin = async (req, res) => {
    try {
        const { name, adminCode } = req.body;

        if (!name || !adminCode) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const newUser = await Ssuperadmin.create({
            name,
            adminCode
        });

        const userResponse = newUser.toObject();

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully.",
            user: userResponse,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


export const verifyAdmin = async (req, res) => {
    try {
        const { adminCode } = req.body;

        if (!adminCode ) {
            return res.status(400).json({
                success: false,
                message: "Admin Code required",
            });
        }

        const admin = await Ssuperadmin.findOne({ adminCode });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin verified successfully",
        });
    } catch (error) {
        console.error("Error verifying Admin:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

