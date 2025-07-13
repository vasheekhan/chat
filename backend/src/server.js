import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";

const PORT=process.env.PORT
const app=express();
app.use(express.json());//other wise body data will be undefined
app.use("/api/auth",authRoutes)
app.get("/",(req,res)=>{
    res.send("hello world");
})
app.listen(PORT,()=>{
    console.log(`Server is started at port ${PORT}`);
    connectDB();
})