import React from 'react'
import { Routes,Route } from 'react-router-dom'
import toast,{Toaster} from "react-hot-toast";
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import Notification from './pages/Notification.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Call from './pages/Call.jsx'
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios.js';


const App = () => {
  const {data}=useQuery({
   queryKey: ["todos"],
    queryFn:async()=>{
    const res=await axiosInstance.get("http://localhost:5001/")
    console.log(res.data)
    return res.data;
    }
  })
  return (
    <div>
      {/* <button onClick={()=>{toast.error("hello world")}}>Create a Toast</button> */}
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/call" element={<Call />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
      <Toaster/>
      </div>
  )
}

export default App
