import express from "express"
import "dotenv/config"
const PORT=process.env.PORT
const app=express();
app.get("/",(req,res)=>{
    res.send("hello world");
})
app.listen(PORT,()=>{
    console.log(`Server is started at port ${PORT}`);
})