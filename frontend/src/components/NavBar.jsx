import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { FaBook } from "react-icons/fa6";

/* Active / inactive nav styles */
const navClass = ({ isActive }) =>
  `relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
   ${isActive
     ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md scale-105"
     : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
   }`;

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3 text-2xl font-bold tracking-wide
                     text-indigo-600 hover:scale-105 transition-transform"
        >
          <FaBook className="mt-1" />
          Book Store
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <NavLink to="/" end className={navClass}>
            <FaHome className="text-xl" />
            Home
          </NavLink>

          <NavLink to="/login" end className={navClass}>
            <FiLogIn className="text-xl" />
            Login / Register
          </NavLink>

        </div>
      </div>
    </nav>
  );
}
