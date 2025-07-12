import mongoose from "mongoose"
export const connectDB=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database is connected succesfully 🚀🚀🚀")
    } catch (error) {
        console.log("error in mongodb",error);
        process.exit(1);//1 mean failure 
    }
}