import {StreamChat} from "stream-chat"
import "dotenv/config"
const apiKey=process.env.STREAM_API_KEY
const apiSecret=process.env.STREAM_API_SECRET
if(!apiKey || !apiSecret){
    console.error("Stream api key or api secret is not present");
}
const streamClient=StreamChat.getInstance(apiKey,apiSecret);
export const upsertStreamUser=async(userData)=>{
    try {
        await streamClient.upsertUser(userData);
        return userData;
    } catch (error) {
        console.error("Something went wrong in creating the user in stream",error.message);
    }
}
export const generateStreamToken=(userId)=>{
try {
    //ensure userid is a string
    const userIdStr=userId.toString();
    return streamClient.createToken(userIdStr);

} catch (error) {
    console.log("Error in getStreamToken ",error);
}
}