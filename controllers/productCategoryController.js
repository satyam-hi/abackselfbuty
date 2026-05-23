import SproductCategory from "../models/productCategoryModel.js";

/**
 * @desc    Get all services
 * @route   GET /api/services
 * @access  Public / Admin
 */
export const getAllProductCategory = async (req, res) => {
    try {
        const services = await SproductCategory.find({},); 
        return res.status(200).json({
            success: true,
            message: "All ProductCategory fetched successfully",
            services,
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
export const registerProductCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Basic validation
        if (!name ) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const existingServices = await SproductCategory.findOne({ name });
        if (existingServices) {
            return res
                .status(409)
                .json({ success: false, message: "ProductCategory is already registered" });
        }

        // Generate custom user ID
        const spcategoryid = `SPCATEGORY-${Date.now()}`; 

        // Create and save new user
        const newServices = await SproductCategory.create({ spcategoryid, name });

        // Exclude password from response
        const ServicesResponse = newServices.toObject();

        return res.status(201).json({
            success: true,
            message: "ProductCategory registered successfully",
            Services: ServicesResponse,
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
