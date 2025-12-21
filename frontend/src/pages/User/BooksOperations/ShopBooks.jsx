import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../../utlis/axiosinstance'
import UserNavBar from '../../Dashboards/UserNavBar'

function ShopBooks() {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load store info + books
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [storeRes, booksRes] = await Promise.all([
                    axiosInstance.get(`/stores/${storeId}`),
                    axiosInstance.get(`/books?storeId=${storeId}`),
                ]);
                setStore(storeRes.data);
                setBooks(booksRes.data.data || []);
            } catch (err) {
                console.error('Failed to load store data or books', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (storeId) load();
    }, [storeId]);

    return (
        <>
            <UserNavBar />
            <div className="p-6">
                <div className="mb-6">
                    <button onClick={() => navigate('/user/stores')} className="text-blue-600 underline">← Back to stores</button>
                </div>

                {loading && <p className="mt-6">Loading store and books…</p>}
                {error && <p className="mt-6 text-red-600">Failed to load store or books.</p>}

                {store && (
                    <div className="bg-white p-6 rounded shadow-sm mb-6">
                        <h1 className="text-2xl font-bold">{store.name}</h1>
                        <p className="text-sm text-gray-600">{store.location}</p>
                        <p className="text-xs text-gray-500 mt-1">Owner: {store.owner?.name || '—'}</p>
                        <p className="text-sm text-gray-700 mt-2">Available books: {books.length}</p>
                    </div>
                )}

                {!loading && books.length === 0 && (
                    <p className="mt-6">No books available for this store.</p>
                )}

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {books.map((b) => (
                        <div key={b._id} className=" rounded-lg p-4 cursor-pointer hover:shadow" style={{backgroundColor:"#a9eaf8a7"}} onClick={() => navigate(`/books/details/${b._id}`)}>
                            <h3 className="font-bold">{`Book : ${b.title}`}</h3>
                            <p className="text-sm text-gray-600">{`Author :${b.author}`}</p>
                            <p className="mt-2">{`In Stocks :${b.copies}`}</p>
                            <p className="mt-2">{`Price :₹${b.price}`}</p>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default ShopBooks