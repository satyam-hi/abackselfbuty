import SlocalAria from "../models/localAriaModel.js";

/**
 * @desc    Get all LocalAria
 * @route   GET /api/localArias
 * @access  Public / Admin
 */
// export const getAllLocalAria = async (req, res) => {
//     try {
//         const loaclArias = await SlocalAria.find({},); 
//         return res.status(200).json({
//             success: true,
//             message: "All loacl city fetched successfully",
//             loaclArias,
//         });
//     } catch (error) {
//         console.error("Error fetching local arias:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };


export const getAllLocalAria = async (req, res) => {
    try {
        const { cityId } = req.query;

        let filter = {};

        // ✅ if cityId is provided → filter by city
        if (cityId) {
            filter.sctyid = cityId;
        }

        const loaclArias = await SlocalAria.find(filter);

        return res.status(200).json({
            success: true,
            message: "Local areas fetched successfully",
            localAreas: loaclArias,
        });

    } catch (error) {
        console.error("Error fetching local areas:", error);
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
export const registerLocalAria = async (req, res) => {
    try {
        const { name, sctyid } = req.body;

        // Basic validation
        if (!name || !sctyid) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const existingCity = await SlocalAria.findOne({ name });
        if (existingCity) {
            return res
                .status(409)
                .json({ success: false, message: "Local City is already registered" });
        }

        // Generate custom user ID
        const sloctyid = `SLOCALCITY-${Date.now()}`;

        // Create and save new user
        const newCity = await SlocalAria.create({ sloctyid, sctyid, name });

        // Exclude password from response
        const cityResponse = newCity.toObject();

        return res.status(201).json({
            success: true,
            message: "Local City registered successfully",
            city: cityResponse,
        });
    } catch (error) {
        console.error("Error registering local city:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
