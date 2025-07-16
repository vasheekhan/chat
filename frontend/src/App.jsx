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


const App = () => {
  return (
    <div>
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
