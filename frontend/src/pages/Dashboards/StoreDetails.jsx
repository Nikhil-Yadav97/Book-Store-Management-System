import React, { useEffect, useState } from 'react';
import UserNavBar from './UserNavBar';
import axiosInstance from '../../utlis/axiosinstance';
import { TbShoppingBag, TbMapPin, TbUserCircle, TbCalendarStats, TbArrowRight } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner'

export default function StoreDetails() {
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getStores = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/users/getstores`);
            setStores(response.data.stores || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStores();
    }, []);

    const handleViewBooks = (storeId) => {
        navigate(`/user/store/${storeId}/books`);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <UserNavBar />
            
            <div className="max-w-7xl mx-auto p-6 lg:p-12">
                {/* Header Section */}
                <header className="mb-12 mt-6">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Partner Stores</h1>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] mt-2">
                        Browse registered bookstores and collections
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center mt-20"><Spinner /></div>
                ) : error ? (
                    <div className="text-center bg-red-50 border border-red-200 p-8 rounded-3xl">
                        <p className="text-red-600 font-bold tracking-tight">Failed to synchronize store data.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stores.map((s) => (
                            <div 
                                key={s._id} 
                                className="group bg-white border border-slate-300 p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] hover:-translate-x-1 hover:-translate-y-1"
                            >
                                <div className="flex flex-col h-full">
                                    {/* Store Icon & Badge */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
                                            <TbShoppingBag className="text-2xl" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                            Active Vendor
                                        </span>
                                    </div>

                                    {/* Store Info */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                            {s.name || 'Unnamed Store'}
                                        </h3>
                                        
                                        <div className="space-y-3 mt-4">
                                            <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                                                <TbMapPin className="text-slate-400 text-lg" />
                                                {s.location || 'Remote Store'}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                                                <TbUserCircle className="text-slate-400 text-lg" />
                                                Owner: <span className="text-slate-900 font-bold">{s.owner?.name || '—'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 font-medium text-[10px] uppercase tracking-wider">
                                                <TbCalendarStats className="text-lg" />
                                                Joined: {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button 
                                        onClick={() => handleViewBooks(s._id)}
                                        className="mt-8 w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 group-hover:shadow-lg"
                                    >
                                        Visit Store
                                        <TbArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {stores.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-slate-400 font-black text-lg">No stores found in your region.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}