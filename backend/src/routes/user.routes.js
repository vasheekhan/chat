import express from "express";
import { protectRoute } from "../middlewares/protectRoutes.js";
import { getRecommendedUsers,getMyFriends,sendFriendRequest,acceptFriendRequest } from "../controllers/user.controller.js";
const router=express.Router();
router.use(protectRoute);
router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);
router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);



export default router;