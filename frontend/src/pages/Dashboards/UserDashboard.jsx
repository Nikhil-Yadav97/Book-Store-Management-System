import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../App.css'

const navClass = ({ isActive }) =>
  isActive ? 'nav-link active' : 'nav-link'

export default function UserDashboard() {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4
                         nav border-b " >
    
          <NavLink to="/" className="text-2xl font-bold text-white">
            Book Store
          </NavLink>
    
          <div className="flex gap-x-9">
            <NavLink to="/" end className={navClass}>Home</NavLink>
            <NavLink to="/login" end className={navClass}>Login</NavLink>
            <NavLink to="/register" end className={navClass}>Register</NavLink>
            <NavLink to="/store" className={navClass}>Store</NavLink>
            <NavLink to="/transactions/user" className={navClass}>Transactions</NavLink>
          </div>
        </nav>
  )
}
