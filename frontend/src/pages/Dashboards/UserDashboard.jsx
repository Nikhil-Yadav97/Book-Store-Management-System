import React, { useContext } from 'react'
import '../../App.css'
import UserNavBar from './UserNavBar'
import { UserContext } from '../../context/userContext'

export default function UserDashboard() {
  const { user } = useContext(UserContext);

  return (
    <>
      <UserNavBar />
      <div className="page-wrapper">

        <div className='userhome'>
           <div className='flex flex-col justify-center content-center'>
              <h1 className='border-2 border-white text-white font-bold text-8xl font-extrabold gradient-text'>
                Welcome, {user?.name}
              </h1>
           </div>

        </div>
      </div>
    </>
  )
}
