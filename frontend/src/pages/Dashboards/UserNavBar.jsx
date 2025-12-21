import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../App.css'

const navClass = ({ isActive }) =>
  isActive ? 'nav-link active' : 'nav-link'

export default function UserNavBar() {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4
                         nav border-b " >
    
          <NavLink to="/" className="text-2xl font-bold text-white">
            Book Store
          </NavLink>
    
          <div className="flex gap-x-9">
            <NavLink to="/user/home" end className={navClass}>Home</NavLink>
            
            <NavLink to="/user/stores" className={navClass}> All Store</NavLink>
            <NavLink to="/user/history" className={navClass}>History</NavLink>
            <NavLink to="/user/profile" className={navClass}>Profile</NavLink>
          </div>
        </nav>
  )
}
