import React from 'react'
import '../App.css'
import NavBar from '../components/NavBar'
    function Home() {
        return (
            <>
            <NavBar/>
            <div className="page "  >
                <h1 className='text-white text-5xl font-bold pt-40 text-center'>Welcome to Book Store</h1>
                
            </div>
            <div className='bg-white' style={{height:"2px"}}></div>
            </>

        )
    }

export default Home