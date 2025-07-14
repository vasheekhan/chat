import User from "../model/User.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { upsertStreamUser } from "../lib/stream.js";
export async function signup(req,res){
    console.log("hitting controller");
    console.log(req.body);
    const {email,password,fullName}=req.body;
    try {
       if(!email || !password ||!fullName){
        return res.status(400).json({
            message:"All fields are required"
        })
       } 
       if(password.length<6){
        return res.status(400).json({
            message:"password length should be more than 6"
        })
       }
       const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
       if(!emailRegex.test(email)){
        return res.status(400).json({
            message:"Invalid email address"
        })
       }
       const existingUser=await User.findOne({email});
       console.log(existingUser);
       if(existingUser){
        return res.status(400).json({
            message:"Email already existing please use different one "
        })
       }
       const idx=Math.floor(Math.random()*100)+1//generate a number between 1 to 100
       console.log("idx",idx);
       const randomAvatar=`https://avatar.iran.liara.run/public/${idx}`//avatar placeholder
       console.log(randomAvatar);
      

     
         const newUser=await User.create({
            email,
            password,
            fullName,
           profilePic:randomAvatar,
         })
          try {
      const streamuser=   await upsertStreamUser({
        id:newUser._id.toString(),
        name:newUser.fullName,
        image:newUser.profilePic|| ""
       })
       console.log(streamuser);
       console.log("Stream user created successfully", streamuser.name)
       } catch (error) {
       console.log("error creating in stream user",error); 
       }
         console.log(newUser);
      const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{
        expiresIn:"7d"
      })
      res.cookie("jwt",token),{
        maxAge:7*24*60*1000,
        httpOnly:true,//prevent xss attack
        sameSite:"strict",//prevent CSFR attacks
        secure:process.env.NODE_ENV==="production",
      };
      res.status(201).json({
        success:true,
        user:newUser,
        
      })

    } catch (error) {
      console.log("Error in singup process");
      res.status(500).json({
        success:false,
        message:"User creation failed",
        error:error
      })  
    }
}
export async function login  (req, res)  {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
console.log("token",token);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
          res.status(200).json({
         message: 'Login successful',
        user:user,
        
      })

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export async function logout(req,res){
   res.clearCookie("token");
   return res.status(200).json({success:true,message:"logout successfull"})
}
export async function onBoard(req,res){
  try {
    const userId=await req.user._id;
    const {fullName,bio,nativeLanguage,learningLanguage,location}=req.body;
    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location ){
    return res.status(400).json({
      success:"false",
      message:"All the fields are required",

    })}
    const updatedUser=await User.findByIdAndUpdate(userId,{fullName,bio,nativeLanguage,learningLanguage,location,isOnboarded:true},{new:true, select: "-password -__v -createdAt -updatedAt"});
    if(!updatedUser){
      return res.status(404).json({
        message:"User not found"
      })
    }
    //update user in stream dashboard
       try {
      const streamuser=await upsertStreamUser({
        id:updatedUser._id.toString(),
        name:updatedUser.fullName,
        image:updatedUser.profilePic|| ""
       })
       console.log(streamuser);
       console.log("Stream user updated after onboarding successfully", streamuser.name)
       } catch (error) {
       console.log("error in updating the stream user",error); 
       }

    return res.status(200).json({
      success:true,
      message:"user updated successfully",
      data:updatedUser
    })
  } catch (error) {
    console.log("something went wrong in onBoard controller",error)
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}
