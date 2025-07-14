import express from "express"
import { signup,login,logout,onBoard } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoutes.js";
const router=express.Router();
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/onboarding",protectRoute,onBoard);
export default router;