import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import  userRoutes from "./routes/user.routes.js"
import chatRoutes from "./routes/chatRoutes.js"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js";

const PORT=process.env.PORT
const app=express();
app.use(express.json());//other wise body data will be undefined
app.use(cookieParser());
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes)

app.listen(PORT,()=>{
    console.log(`Server is started at port ${PORT}`);
    connectDB();
})