import SproductType from "../models/productTypeModel.js";

/**
 * @desc    Get all services
 * @route   GET /api/services
 * @access  Public / Admin
 */
export const getAllProductType = async (req, res) => {
    try {
        const productType = await SproductType.find({},); 
        return res.status(200).json({
            success: true,
            message: "All AllProductType fetched successfully",
            productType,
        });
    } catch (error) {
        console.error("Error fetching Services:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Register new Services
 * @route   POST /api/services/register
 * @access  Public
 */
export const registerProductType = async (req, res) => {
    try {
        const { name } = req.body;

        // Basic validation
        if (!name ) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const existingServices = await SproductType.findOne({ name });
        if (existingServices) {
            return res
                .status(409)
                .json({ success: false, message: "AllProductType is already registered" });
        }

        // Generate custom user ID
        const sptypeid = `SPTYPE-${Date.now()}`; 

        // Create and save new user
        const newServices = await SproductType.create({ sptypeid, name });

        // Exclude password from response
        const ServicesResponse = newServices.toObject();

        return res.status(201).json({
            success: true,
            message: "AllProductType registered successfully",
            productType: ServicesResponse,
        });
    } catch (error) {
        console.error("Error registering Service:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
