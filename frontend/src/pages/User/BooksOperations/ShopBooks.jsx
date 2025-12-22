import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../../utlis/axiosinstance'
import UserNavBar from '../../Dashboards/UserNavBar'
import { IoAddSharp } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { LuMinus } from "react-icons/lu";
import { UserContext } from '../../../context/userContext.jsx';
import { useContext} from 'react';
function ShopBooks() {
    const {user}=useContext(UserContext)
    const { storeId } = useParams();
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [store, setStore] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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


                const initialQty = {};
                booksRes.data.data?.forEach(b => {
                    initialQty[b._id] = 1;
                });
                setQuantities(initialQty);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (storeId) load();
    }, [storeId]);

    const increaseQty = (e, book) => {
        e.stopPropagation();
        setQuantities(prev => ({
            ...prev,
            [book._id]: Math.min(prev[book._id] + 1, book.copies)
        }));
    };

    const decreaseQty = (e, book) => {
        e.stopPropagation();
        setQuantities(prev => ({
            ...prev,
            [book._id]: Math.max(prev[book._id] - 1, 1)
        }));
    };

    const buyBook = async (e, book) => {
        e.stopPropagation();
        const quantity = quantities[book._id] || 1;

        try {
            // Call backend purchase endpoint
            const res = await axiosInstance.post(`/books/${book._id}/buy`, { quantity });

            // success -> update UI and user context
            if (res?.status === 201) {
                // reduce local copies so UI reflects purchase
                setBooks(prev => prev.map(b => b._id === book._id ? { ...b, copies: b.copies - quantity } : b));

                // update user balance in context (transaction returned is first entry)
                const tx = res.data.transactions?.[0];
                if (tx && typeof tx.balanceAfter !== 'undefined') {
                    // lazy import to avoid circular deps
                    const { UserContext } = await import("../../../context/userContext.jsx");
                    // can't directly update context here; use window event to notify
                    const evt = new CustomEvent('userBalanceUpdated', { detail: { balance: tx.balanceAfter } });
                    window.dispatchEvent(evt);
                }

                alert('Purchase successful');
            }
        } catch (error) {
            console.error("Error while Buying Book", error);
            const msg = error?.response?.data?.message || error.message || 'Purchase failed';
            alert(msg);
        }
    };

    return (
        <>
            <UserNavBar />
            <div className="p-6 ">

                <div className='flex flex-row  justify-between'>

                {store && (
                    <div className="bg-white p-6 rounded shadow-lg mb-6" style={{backgroundColor:"#0ed56870"}}>
                        <h1 className="text-2xl font-bold">{store.name}</h1>
                        <p className="text-sm text-gray-600">{store.location}</p>
                        <p className="text-sm mt-2">Available books: {books.length}</p>
                    </div>
                )}

                <div style={{backgroundColor:" ", height:""}} className='flex flex-col p-6 mr-10'>
                    <h1 className='text-2xl font-medium font-semibold mb-2 ml-3' style={{height:"40px",width:"140px"}}>Balance</h1>
                    <span className='rounded-sm text-center p-3' style={{backgroundColor:"#3ef625ff",height:"40px",width:"140px"}}> ₹{user.balance}</span>
                </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {books.map(book => (
                        <div
                            key={book._id}
                            className="rounded-lg p-4 hover:shadow cursor-pointer"
                            style={{ backgroundColor: "#a9eaf8a7" }}
                            onClick={() => navigate(`/books/details/${book._id}`)}
                        >
                            <h3 className="font-bold">Book: {book.title}</h3>
                            <p className="text-sm">Author: {book.author}</p>
                            <p className="mt-1">Stock: {book.copies}</p>
                            <p className="mt-1 font-semibold">₹{book.price}</p>

                            {/* Quantity + Cart */}
                            <div
                                className="mt-4 p-3 rounded-lg flex items-center justify-between"
                                style={{ backgroundColor: "#f5f2ebff" }}
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => decreaseQty(e, book)}
                                        className="p-1 bg-gray-200 rounded"
                                    >
                                        <LuMinus />
                                    </button>

                                    <span className="font-semibold w-6 text-center">
                                        {quantities[book._id] || 1}
                                    </span>

                                    <button
                                        onClick={(e) => increaseQty(e, book)}
                                        className="p-1 bg-gray-200 rounded"
                                    >
                                        <IoAddSharp />
                                    </button>
                                </div>


                                <span className="font-semibold text-sm">
                                    Total ₹{(quantities[book._id] || 1) * book.price}
                                </span>
                                <button
                                    onClick={(e) => buyBook(e, book)}
                                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <FaCartShopping />
                                    Buy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}

export default ShopBooks;
