import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { FaBook, FaHome } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { AiOutlineTransaction } from "react-icons/ai";
import { TbLogout2 } from "react-icons/tb";

/* Active link styling */
const navClass = ({ isActive }) =>
  `relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
   ${isActive
     ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md scale-105"
     : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
   }`;

function OwnerNavbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3 text-2xl font-bold tracking-wide text-indigo-600 hover:scale-105 transition-transform"
        >
          <FaBook />
          Book Store
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <NavLink to="/dashboard" className={navClass}>
            <FaHome className="text-xl" />
            Home
          </NavLink>

          <NavLink to="/store" className={navClass}>
            <IoStorefrontSharp className="text-xl" />
            Store
          </NavLink>

          <NavLink
            to={user?.store ? `/owner/stores/${user.store}/dashboard` : "#"}
            className={navClass}
            onClick={(e) => {
              if (!user?.store) e.preventDefault();
            }}
          >
            <AiOutlineTransaction className="text-xl" />
            Transactions
          </NavLink>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 rounded-lg
                       bg-gradient-to-r from-red-500 to-red-600
                       text-white font-medium shadow-md
                       hover:from-red-600 hover:to-red-700
                       hover:scale-105 transition-all duration-300"
          >
            <TbLogout2 className="text-xl" />
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

export default OwnerNavbar;
