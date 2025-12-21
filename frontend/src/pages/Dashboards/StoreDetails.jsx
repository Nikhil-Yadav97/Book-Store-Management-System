import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import axiosInstance from '../../utlis/axiosinstance'

export default function StoreDetails() {
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

    return (
        <>
            <UserNavBar />
            <div className='p-5 flex flex-col gap-8' style={{ minHeight: "400px" }}>
                <h1 className='mt-5 text-4xl font-semibold text-black text-center'>Available Stores</h1>

                {loading && <p className='text-center mt-6'>Loading stores...</p>}
                {error && <p className='text-center mt-6 text-red-600'>Failed to load stores.</p>}

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6' style={{height:"200px" }} >
                    {stores.map((s) => (
                        <div key={s._id} className=' rounded p-4  ' style={{backgroundColor:"#279b994e"}}>
                            <h3 className='text-xl font-bold'>{s.name || 'Unnamed Store'}</h3>
                            <p className='text-sm text-gray-600'>{s.location || 'No location provided'}</p>
                            <p className='mt-2'><strong>Owner:</strong> {s.owner?.name || '—'}</p>
                            <p className='text-xs text-gray-500 mt-2'>Since: {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</p>
                        </div>
                    ))}

                    {!loading && stores.length === 0 && (
                        <p className='text-center col-span-full mt-6'>No stores available.</p>
                    )}
                </div>

            </div>
        </>
    )
} 
