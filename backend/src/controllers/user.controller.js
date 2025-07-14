import User from "../model/User.js";

export async function getRecommendedUsers(req,res){
    try {
        const currentUserId=req.user._id;
        const currentUser=req.user;
        const recommendUsers=await User.find({
            $and:[
                {
                    _id:{$ne:currentUserId}//exclude my self
                
                },{
                    _id:{$nin:currentUser.friends}//exclude current users freinds
                },{
                    isOnBoarded:true
                }
            ]
        })
        res.status(200).json(recommendUsers)

    } catch (error) {
        res.status(500).json({message:"Internal Server error"})
    }
};
export async function getMyFriends(req,res){
    try {
        const user=await User.findById(req.user.id).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({message:"Something went wrong "});
    }
};