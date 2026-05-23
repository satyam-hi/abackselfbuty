import Scity from "../models/cityModel.js";

/**
 * @desc    Get all City
 * @route   GET /api/city
 * @access  Public / Admin --
 */
export const getAllCity = async (req, res) => {
    try {
        const citys = await Scity.find({},); 
        return res.status(200).json({
            success: true,
            message: "All city fetched successfully",
            citys,
        });
    } catch (error) {
        console.error("Error fetching City:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Register new City
 * @route   POST /api/city/register
 * @access  Public
 */
export const registerCity = async (req, res) => {
    try {
        const { name } = req.body;

        // Basic validation
        if (!name ) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const existingCity = await Scity.findOne({ name });
        if (existingCity) {
            return res
                .status(409)
                .json({ success: false, message: "City is already registered" });
        }

        // Generate custom user ID
        const sctyid = `SCITY-${Date.now()}`;

        // Create and save new user
        const newCity = await Scity.create({ sctyid, name });

        // Exclude password from response
        const cityResponse = newCity.toObject();

        return res.status(201).json({
            success: true,
            message: "City registered successfully",
            city: cityResponse,
        });
    } catch (error) {
        console.error("Error registering city:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
