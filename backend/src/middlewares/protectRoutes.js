import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const protectRoute = async(req, res, next) => {
    const token = req.cookies.token;
 console.log(token);
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user=await User.findById(decoded.userId).select("-password");
        req.user = user; // You can attach more data if you want
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
