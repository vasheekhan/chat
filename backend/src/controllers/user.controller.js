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
export async function acceptFriendRequest(req,res){
    try {
        const {id:requestId}=req.params;
        const friendRequest=await FriendRequest.findById(requestId);

        //check if the friend request exist 
        if(!friendRequest){
          return  res.status(400).json({message:"Friend request not found"});
        }

        //check if the friend request is already accepted
        if (friendRequest.status === "accepted") {
            return res.status(403).json({ message: "Friend request is already accepted" });
        }
        //verify the current user is recipient 
        if(friendRequest.recipient.toString()!==req.user.id){
            return res.status(403).json({message:"you are not authorized to accept this request"});
        }
        //change the pending to accepted 
        friendRequest.status="accepted";
        await friendRequest.save();

        //add each user to the other's friends array
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient},
        })
         await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender},
        })

       return  res.status(200).json({message:"Friend request accepted"});
    } catch (error) {
         console.error("Error accepting friend request:", error);
       return  res.status(500).json({message:"Internal Server Error"})
    }
}
export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        }).populate("sender","fullname profilePic nativeLanguage learningLanguage");
        const acceptedReqs = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted"
        }).populate("recipient","fullname profilePic ");

        return res.status(200).json({
           incomingReqs,
           acceptedReqs
        });
    } catch (error) {
        console.log("error in getting friend",error);
        return res.status(500).json({
            success: false,
            message: "Failed to get friend requests",
            error: error.message
        });
    }
}
export async function getOutgoingFriendReqs(req,res){
 try {
    const outgoingRequests=await FriendRequest.find({
        sender:req.user.id,
        status:"pending",
    }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");
    res.status(200).json(outgoingRequests)
 } catch (error) {
    console.error("Error in getoutgoingRequests",error.message)
    res.status(500).json({message:"Internal Server error"});
 }   
}
