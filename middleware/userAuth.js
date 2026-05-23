import jwt from "jsonwebtoken";
// import Suser from "../models/Suser.js";
import Suser from "../models/suserModel.js";


export const userAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, "SECRET_KEY");
              const suid =   decoded.id

        const user = await Suser.findOne({suid});

        if (!user || user.accesstoken !== token) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        req.user = decoded;

        next();

    } catch (error) {
        console.log("Auth middleware error:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};
