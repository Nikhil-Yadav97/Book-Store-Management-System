import React from 'react'
import { Link } from 'react-router-dom'
import { BsArrowLeft } from 'react-icons/bs'


function BackButton({destination='/store'}) {
  return (
    <div className='flex'>
        <Link to={destination}
        className='bg-blue-800 text-white px-4 py-1  rounded-full' >
        <BsArrowLeft className='text-2xl'/>
        </Link>
    </div>
  )
}

export default BackButton