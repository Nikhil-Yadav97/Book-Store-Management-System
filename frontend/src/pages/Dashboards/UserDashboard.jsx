import React, { useContext } from 'react';
import UserNavBar from './UserNavBar';
import { UserContext } from '../../context/userContext';
import { TbBook, TbHistory, TbSettings, TbArrowRight } from 'react-icons/tb';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <UserNavBar />
      
      <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full">
        {/* Welcome Hero Section */}
        <section className="relative bg-slate-900 rounded-[2.5rem] p-10 lg:p-16 overflow-hidden shadow-2xl mb-10">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full -ml-10 -mb-10 blur-3xl"></div>

          <div className="relative z-10">
            <p className="text-blue-400 font-black uppercase text-xs tracking-[0.3em] mb-4">
              Reader Dashboard
            </p>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {user?.name || "Reader"}
              </span>
            </h1>
            <p className="text-slate-400 mt-6 max-w-lg font-medium text-lg">
              Explore new titles, manage your library, and track your reading journey all in one place.
            </p>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DashboardCard 
            icon={<TbBook className="text-4xl" />}
            title="Browse Books"
            desc="Explore the latest collection in the store."
            link="/user/books"
            color="bg-white"
          />
          <DashboardCard 
            icon={<TbHistory className="text-4xl" />}
            title="My Orders"
            desc="Check your previous purchases and status."
            link="/user/orders"
            color="bg-white"
          />
          <DashboardCard 
            icon={<TbSettings className="text-4xl" />}
            title="Account"
            desc="Update your profile and preferences."
            link="/user/profile"
            color="bg-white"
          />
        </div>
      </main>
    </div>
  );
}

// Sub-component for clean code and consistent "Erect" shadow style
function DashboardCard({ icon, title, desc, link, color }) {
  return (
    <Link to={link} className="group">
      <div className={`${color} border border-slate-300 p-8 rounded-3xl transition-all duration-300 shadow-[0_4px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-x-1 group-hover:-translate-y-1`}>
        <div className="text-slate-900 mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
          {icon}
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
          {desc}
        </p>
        <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest">
          Explore <TbArrowRight className="group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  );
}