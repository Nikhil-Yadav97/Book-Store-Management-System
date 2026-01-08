import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { LuBookOpen, LuShieldCheck, LuZap, LuArrowRight } from "react-icons/lu"
// ✅ CORRECT
import { 
  LuLibrary, 
  LuShoppingCart, 
  LuUsers 
} from "react-icons/lu";

function Home() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30">
            <NavBar />

            
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        New releases just arrived
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                        Read. Imagine. <br /> Discover Your Next Story.
                    </h1>
                    
                    <p className="text-slate-400 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Explore a curated collection of thousands of books from independent authors and world-class publishers, all delivered to your digital doorstep.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/explore" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group">
                            Browse Collection 
                            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Inventory Management */}
        <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                <LuLibrary size={24} />
            </div>
            <h3 className="text-xl font-bold">Inventory Management</h3>
            <p className="text-slate-400 leading-relaxed">
                Manage book inventory with real-time stock updates, category organization, and low-stock alerts.
            </p>
        </div>

        {/* Sales & Billing */}
        <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                <LuShoppingCart size={24} />
            </div>
            <h3 className="text-xl font-bold">Sales & Billing</h3>
            <p className="text-slate-400 leading-relaxed">
                Generate invoices, automate billing, and maintain accurate sales records for business tracking.
            </p>
        </div>

        {/* User & Role Management */}
        <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <LuUsers size={24} />
            </div>
            <h3 className="text-xl font-bold">User & Role Management</h3>
            <p className="text-slate-400 leading-relaxed">
                Role-based access control for admins and staff to ensure secure and organized store operations.
            </p>
        </div>

    </div>
</section>

           
            
            
        </div>
    )
}

export default Home;