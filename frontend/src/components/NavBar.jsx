import { NavLink } from 'react-router-dom'
import React from 'react'
import '../App.css'
import { FiLogIn } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";

const navClass = ({ isActive }) =>
  isActive ? 'nav-link active' : 'nav-link'

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4
                     nav border-b " >

      <NavLink to="/" className="text-2xl font-bold text-black flex flex-row gap-3">
      <FaBook className='mt-1 '/>
        Book Store
      </NavLink>

      <div className="flex gap-x-9">
        <NavLink to="/" end  className={({ isActive }) =>
                        `${navClass({ isActive })} flex items-center gap-2`
                    } ><FaHome />Home</NavLink>
        <NavLink to="/login" end  className={({ isActive }) =>
                        `${navClass({ isActive })} flex items-center gap-2`
                    } ><FiLogIn />Login/Register</NavLink>
        
        
      </div>
    </nav>
  )
}
