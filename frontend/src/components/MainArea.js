import React, { useEffect } from 'react'
import Navbar from './Navbar'
import '../styles/Main-Area.css'
import { Outlet, useNavigate } from 'react-router-dom'

export default function MainArea() {
  const navigate=useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem("token")){
      navigate('/login');
    }
  },[localStorage.getItem('token')]);
  
  return (
    <div>
      {/* Navbar */}

      <Navbar/>  
      <Outlet/>  
        {/* <ImageUpload/> */}
    </div>
  )
}
