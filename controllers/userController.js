import Suser from "../models/suserModel.js";
import jwt from "jsonwebtoken";


import { sendEmail } from "../utils/sendEmail.js"

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public / Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        // const users = await Suser.find({}, "-password"); // exclude password field
        const users = await Suser.find({}); // include password field
        return res.status(200).json({
            success: true,
            message: "All users fetched successfully",
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

export const registerUser = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        if (!name || !email || !mobile || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await Suser.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        const suid = `SUSER-${Date.now()}`;
        const accesstoken = "";
        const sessionAccesstoken = "";
        const emailVerifyAccesstoken = `${Math.floor(
            100000 + Math.random() * 900000
        )}`;
        const emailVerify = false;


                const emailSent = await sendEmail(
            email,
            "Verify Email",
            `Your verification code is: ${emailVerifyAccesstoken}`
        );

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: "User not registered because of email failed to send",
            });
        }

        const newUser = await Suser.create({
            suid,
            name,
            email,
            mobile,
            password,
            accesstoken,
            sessionAccesstoken,
            emailVerifyAccesstoken,
            emailVerify,
        });

        // await sendEmail(
        //     email,
        //     "Verify Email",
        //     `Your verification code is: ${emailVerifyAccesstoken}`
        // );



        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Check your email for OTP.",
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


export const verifyEmail = async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        if (!email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email with New Password and OTP required",
            });
        }

        const user = await Suser.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.emailVerifyAccesstoken !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        user.emailVerify = true;
        user.emailVerifyAccesstoken = "";
        user.password = password;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error("Error verifying email:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await Suser.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

        user.emailVerifyAccesstoken = otp;
        await user.save();

        await sendEmail(
            email,
            "Reset Your Password",
            `Your password reset OTP is: ${otp}`
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email",
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await Suser.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.emailVerify) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email first",
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.suid, email: user.email },
            "SECRET_KEY",
            { expiresIn: "7d" }
        );

        user.accesstoken = token;
        await user.save();

        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userData,
        });

    } catch (error) {
        console.log("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};




export const logoutUser = async (req, res) => {
    try {
        const { suid } = req.body;

        const user = await Suser.findOne({ suid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.accesstoken = "";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });

    } catch (error) {
        console.log("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


//  ========= GET USER BY SUID ====================

export const getUserBySuid = async (req, res) => {
    try {
        const { suid } = req.params;

        if (!suid) {
            return res.status(400).json({
                success: false,
                message: "suid is required",
            });
        }

        const user = await Suser.findOne({ suid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        console.error("Error fetching user by suid:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


//==============verify token ======================

export const verifyUserToken = async (req, res) => {
    const { token, id, role } = req.body;

    // Check for required fields
    if (!token || !id || !role) {
        return res.status(400).json({
            success: false,
            valid: false,
            message: "Token, id and role are required",
        });
    }

    try {
        const suid = id;
        const accesstoken = token;

        // Check if a user exists with this ID + token
        const user = await Suser.findOne({ suid, accesstoken });

        if (!user) {
            return res.json({
                success: false,
                valid: false,
                message: "Invalid token or user not found",
            });
        }

        return res.json({
            success: true,
            valid: true, // token matched
        });

    } catch (err) {
        return res.json({
            success: false,
            valid: false,
            message: "Error verifying token",
        });
    }
};



// ================= UPDATE PROVIDER ID =================

export const updateProviderId = async (req, res) => {
    try {
        const { suid, sprovid } = req.body;

        if (!suid || !sprovid) {
            return res.status(400).json({
                success: false,
                message: "suid and sprovid are required",
            });
        }

        const user = await Suser.findOne({ suid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update provider id
        user.sprovid = sprovid;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Provider ID updated successfully",
            user,
        });

    } catch (error) {
        console.error("Update provider id error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// ================= GET USERS BY PROVIDER ID =================

export const getUsersByProviderId = async (req, res) => {
    try {

        const { sprovid } = req.params;

        if (!sprovid) {
            return res.status(400).json({
                success: false,
                message: "Provider ID required",
            });
        }

        const users = await Suser.find({ sprovid });

        return res.status(200).json({
            success: true,
            users,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};