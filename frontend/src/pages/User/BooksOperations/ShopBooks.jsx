import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utlis/axiosinstance';
import UserNavBar from '../../Dashboards/UserNavBar';
import { IoAddSharp } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { LuMinus, LuMapPin, LuBookOpen, LuWallet } from "react-icons/lu";
import { UserContext } from '../../../context/userContext.jsx';
import { useSnackbar } from 'notistack';
function ShopBooks() {
    const { user } = useContext(UserContext);
    const { storeId } = useParams();
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const [books, setBooks] = useState([]);
    const [store, setStore] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [storeRes, booksRes] = await Promise.all([
                    axiosInstance.get(`/stores/${storeId}`),
                    axiosInstance.get(`/books?storeId=${storeId}`),
                ]);

                setStore(storeRes.data);
                const fetchedBooks = booksRes.data.data || [];
                setBooks(fetchedBooks);

                const initialQty = {};
                fetchedBooks.forEach(b => {
                    initialQty[b._id] = 1;
                });
                setQuantities(initialQty);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (storeId) load();
    }, []);

    const handleQty = (e, bookId, delta, max) => {
        e.stopPropagation();
        setQuantities(prev => ({
            ...prev,
            [bookId]: Math.min(Math.max((prev[bookId] || 1) + delta, 1), max)
        }));
    };

    const buyBook = async (e, book) => {
        e.stopPropagation();
        const quantity = quantities[book._id] || 1;
        try {
            const res = await axiosInstance.post(`/books/${book._id}/buy`, { quantity });
            if (res?.status === 201) {
                setBooks(prev => prev.map(b => b._id === book._id ? { ...b, copies: b.copies - quantity } : b));
                const tx = res.data.transactions?.[0];
                if (tx && typeof tx.balanceAfter !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('userBalanceUpdated', { detail: { balance: tx.balanceAfter } }));
                }
                enqueueSnackbar("Purchase Successfull", { variant: "success" });

            }
        } catch (error) {

            enqueueSnackbar(error?.response?.data?.message || 'Purchase failed', { variant: "error" });
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <UserNavBar />
            <div className="p-8 animate-pulse space-y-4">
                <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <UserNavBar />

            <main className="max-w-7xl mx-auto p-6 lg:p-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    {store && (
                        <div className="relative overflow-hidden bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex-1 w-full">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <LuBookOpen size={80} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{store.name}</h1>
                            <div className="flex items-center gap-2 text-slate-500 mt-2">
                                <LuMapPin size={16} />
                                <p className="text-sm font-medium">{store.location}</p>
                            </div>
                            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                                {books.length} Titles Available
                            </div>
                        </div>
                    )}

                    <div className="bg-indigo-600 p-8 rounded-2xl shadow-lg shadow-indigo-200 text-white min-w-[240px] w-full md:w-auto">
                        <div className="flex items-center gap-2 mb-1 opacity-80">
                            <LuWallet size={18} />
                            <span className="text-sm font-semibold uppercase tracking-wider">Your Balance</span>
                        </div>
                        <div className="text-4xl font-bold italic">₹{user?.balance?.toLocaleString()}</div>
                    </div>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map(book => (
                        <div
                            key={book._id}
                            onClick={() => navigate(`/books/details/${book._id}`)}
                            className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                        {book.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm italic">by {book.author}</p>
                                </div>

                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Price</p>
                                        <p className="text-2xl font-black text-slate-900">₹{book.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Stock</p>
                                        <p className={`font-bold ${book.copies < 5 ? 'text-red-500' : 'text-slate-700'}`}>
                                            {book.copies} units
                                        </p>
                                    </div>
                                </div>

                                {/* Modern Control Panel */}
                                <div
                                    className="bg-slate-50 p-4 rounded-xl flex items-center justify-between gap-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                        <button
                                            onClick={(e) => handleQty(e, book._id, -1, book.copies)}
                                            className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                                        >
                                            <LuMinus size={16} />
                                        </button>
                                        <span className="w-10 text-center font-bold text-slate-800">
                                            {quantities[book._id] || 1}
                                        </span>
                                        <button
                                            onClick={(e) => handleQty(e, book._id, 1, book.copies)}
                                            className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                                        >
                                            <IoAddSharp size={18} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={(e) => buyBook(e, book)}
                                        disabled={book.copies === 0}
                                        className="flex-1 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-300 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        <FaCartShopping size={16} />
                                        <span>Buy</span>
                                    </button>
                                </div>
                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest">
                                    Total: ₹{((quantities[book._id] || 1) * book.price).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default ShopBooks;