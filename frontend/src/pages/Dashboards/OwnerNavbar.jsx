import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import '../../App.css'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { FaStore } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { TbLogout2 } from "react-icons/tb";
import { FaBook } from "react-icons/fa6";
const navClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link'

function OwnerNavbar() {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };
    return (
        <div>
            <nav className="sticky top-0 z-50 flex justify-between items-center p-4
                         nav border-b " >

                <NavLink to="/" className="text-2xl font-bold text-black flex flex-row gap-3">
                    <FaBook className='mt-1 ' />
                    Book Store
                </NavLink>


                <div className="flex gap-x-9">
                    <NavLink to="/dashboard" className={({ isActive }) =>
                        `${navClass({ isActive })} flex items-center gap-2`
                    } style={{ marginTop: "5px" }}><FaHome className='text-2xl' />Home</NavLink>
                    <NavLink
                        to="/store"
                        className={({ isActive }) =>
                            `${navClass({ isActive })} flex items-center gap-2`
                        }
                        style={{ marginTop: "5px" }}
                    >
                        <IoStorefrontSharp className="text-2xl" />
                        <span>Store</span>
                    </NavLink>
                    <NavLink to={user?.store ? `/owner/stores/${user.store}/dashboard` : "#"} className={({ isActive }) =>
                        `${navClass({ isActive })} flex items-center gap-2`
                    } style={{ marginTop: "5px" }} {...(!user?.store && { onClick: (e) => e.preventDefault() })}>
                        <AiOutlineTransaction className='text-2xl' /> Transactions
                    </NavLink>

                    <button className='rounded-sm text-white p-2 bg-red-600 hover:bg-red-700 hover:text-black' onClick={handleLogout} style={{ height: "40px", width: "150px" }}>
                        <div className='flex items-center gap-2 flex-row' >
                            <TbLogout2 className='text-2xl' />
                            Logout
                        </div>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default OwnerNavbar