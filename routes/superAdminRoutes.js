import express from "express";
import {
    getAllAdmin,
    registerAdmin,
    verifyAdmin
} from "../controllers/superAdminController.js";

const SuperAdminRouter = express.Router();

/**
 * @route   GET /api/superadmin
 * @desc    Get all admins
 */
SuperAdminRouter.get("/", getAllAdmin);

/**
 * @route   POST /api/superadmin/register
 * @desc    Register new admin
 */
SuperAdminRouter.post("/register", registerAdmin);

/**
 * @route   POST /api/superadmin/verify
 * @desc    Verify admin using adminCode
 */
SuperAdminRouter.post("/verify", verifyAdmin);

export default SuperAdminRouter;