import User from "../model/User.js"
import jwt from "jsonwebtoken";
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
export async function login(req,res){
    res.send("login controller");
}
export async function logout(req,res){
    res.send("logout controller");
}
