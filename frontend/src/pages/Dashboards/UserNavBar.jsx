import React from "react";
import { NavLink } from "react-router-dom";
import { FaBook, FaHome, FaUser } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { AiOutlineHistory } from "react-icons/ai";

/* Active link styling */
const navClass = ({ isActive }) =>
  `relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
   ${isActive
     ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md scale-105"
     : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
   }`;

export default function UserNavBar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3 text-2xl font-bold tracking-wide
                     text-indigo-600 hover:scale-105 transition-transform"
        >
          <FaBook />
          Book Store
        </NavLink>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">

          <NavLink to="/user/home" end className={navClass}>
            <FaHome className="text-xl" />
            Home
          </NavLink>

          <NavLink to="/user/stores" className={navClass}>
            <IoStorefrontSharp className="text-xl" />
            Stores
          </NavLink>

          <NavLink to="/user/history" className={navClass}>
            <AiOutlineHistory className="text-xl" />
            History
          </NavLink>

          <NavLink to="/user/profile" className={navClass}>
            <FaUser className="text-xl" />
            Profile
          </NavLink>

        </div>
      </div>
    </nav>
  );
}
