import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { LuBookOpen, LuShieldCheck, LuZap, LuArrowRight } from "react-icons/lu"

function Home() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30">
            <NavBar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Decorative Background Glows */}
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
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                            <LuZap size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Instant Delivery</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Purchase and start reading in seconds. Our digital library syncs instantly across all your devices.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                            <LuBookOpen size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Personalized Library</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Keep track of your favorites, finished reads, and upcoming wishlist in one intuitive interface.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                            <LuShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Secure Transactions</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Your wallet and data are protected with enterprise-grade encryption for every single purchase.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer-like Divider */}
            <div className="bg-gradient-to-r from-transparent via-slate-800 to-transparent h-px w-full max-w-5xl mx-auto"></div>
            
            <footer className="py-10 text-center text-slate-500 text-sm">
                © 2025 BookStore Inc. Built for book lovers everywhere.
            </footer>
        </div>
    )
}

export default Home;