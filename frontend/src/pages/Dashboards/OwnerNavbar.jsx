import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../App.css'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'

const navClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link'

function OwnerNavbar() {
    const { user, logout } = useContext(UserContext);
    return (
        <div>
            <nav className="sticky top-0 z-50 flex justify-between items-center p-4
                         nav border-b " >

                <NavLink to="/" className="text-2xl font-bold text-white">
                    Book Store
                </NavLink>


                <div className="flex gap-x-9">
                    <NavLink to="/dashboard" end className={navClass} style={{ marginTop: "5px" }}>Home</NavLink>
                    <NavLink to="/store" className={navClass} style={{ marginTop: "5px" }}>Store</NavLink>
                    <NavLink to="/transactions/owner" className={navClass} style={{ marginTop: "5px" }}>Transactions</NavLink>
                    
                    <NavLink to="/" className={navClass} >
                        <button className='rounded-sm text-white p-2 bg-red-600 hover:bg-red-700 hover:text-black' onClick={logout} style={{ height: "40px", width: "80px" }}>
                            Logout
                        </button>
                    </NavLink>
                </div>
            </nav>
        </div>
    )
}

export default OwnerNavbar