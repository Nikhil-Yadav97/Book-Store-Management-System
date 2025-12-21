import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import axiosInstance from '../../utlis/axiosinstance'
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

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
            console.error("Error while fetching stores", err);
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
        <>
            <UserNavBar />
            <div className='p-6 flex flex-col gap-6' style={{ minHeight: "400px" }}>
                <h1 className='mt-5 text-4xl font-semibold text-gray-900 text-center'>Available Stores</h1>

                {loading && <p className='text-center mt-6'>Loading stores...</p>}
                {error && <p className='text-center mt-6 text-red-600'>Failed to load stores.</p>}

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
                    {stores.map((s) => (
                        <div key={s._id} className='rounded p-6 bg-white shadow-sm border'>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <h3 className='text-xl font-bold text-gray-800'>{s.name || 'Unnamed Store'}</h3>
                                    <p className='text-sm text-gray-600'>{s.location || 'No location provided'}</p>
                                    <p className='mt-2 text-xs text-gray-500'><strong>Owner:</strong> {s.owner?.name || '—'}</p>
                                    <p className='mt-1 text-xs text-gray-400'>Since: {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</p>
                                </div>
                                <div className='flex flex-col items-end gap-2'>
                                    <button onClick={() => handleViewBooks(s._id)} className='flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700'>
                                        <FaShoppingCart />
                                        <span>Shop</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {stores.length === 0 && !loading && (
                        <p className='text-center col-span-full mt-6'>No stores available.</p>
                    )}
                </div>

            </div>
        </>
    )
} 
