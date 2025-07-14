import FriendRequest from "../model/FriendRequest.js";
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
export async function sendFriendRequest(req,res){
 try {  const myId=req.user.id;
    const {id:recipientId}=req.params;
    //prevent sending request to yourself
    if(myId==recipientId)return res.status(400).json({message:"you cannot send friend request to your self"});
    const recipient=await User.findById(recipientId);

    //check if recipient is existing or not
    if(!recipient){
        return res.status(400).json({message:"Recipient not found"});
    }
    //check if we are already freinds;
    if(recipient.friends.includes(myId)){
        return res.status(400).json({message:"we are already friends"});
    }
    //check if a req already exist
    const existingRequest=await FriendRequest.findOne({
        $or:[
            {
                sender:myId,
                recipient:recipientId
            },{
                sender:recipientId,
                recipient:senderId
            }
        ]
    })
    if(existingRequest){
        return res.status(400).json({
            message:"friends request already exist"
        })

    }
    const friendRequest=await FriendRequest.create({
        sender:myId,
        recipient:recipientId
    })
    res.status(201).json(friendRequest);
    } catch (error) {
        res.status(500).json({message:"Something went wrong "});
    }
}