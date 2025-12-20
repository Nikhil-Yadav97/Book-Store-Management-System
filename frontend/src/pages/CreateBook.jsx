import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import axiosInstance from '../utlis/axiosinstance';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { useSnackbar } from 'notistack';
import OwnerNavbar from './Dashboards/OwnerNavbar';
import "../App.css"
import { UserContext } from '../context/userContext.jsx';

export default function CreateBook() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publishYear, setPublishYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [copies, setCopies] = useState(1);
    const [description, setDescription] = useState('');
    const [genres, setGenres] = useState([])

    const [price, setPrice] = useState('');
    const [storeDetails, setStoreDetails] = useState(null);
    const [storeLoading, setStoreLoading] = useState(false);
    const navigate = useNavigate();
    const genreOptions = ["General", "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Motivational", "Biography", "History", "Science", "Romance", "Thriller", "Mystery", "Horror"]


    const { enqueueSnackbar } = useSnackbar();
    const { user } = useContext(UserContext);

    useEffect(() => {
        const loadStore = async () => {
            if (!user || user.role !== 'Owner') return;
            setStoreLoading(true);
            try {
                const res = await axiosInstance.get('/stores/me');
                setStoreDetails(res.data);
            } catch (err) {
                console.error('Failed to load store details', err?.response?.data || err.message);
            } finally {
                setStoreLoading(false);
            }
        };

        loadStore();
    }, [user]);

    const handleSaveBook = async () => {
        try {
            const token = localStorage.getItem("token");
            const storeId = storeDetails?._id || user?.store;

            const totalCost = Number(price) * Number(copies);

            if (isNaN(totalCost) || totalCost <= 0) {
                enqueueSnackbar("Invalid price or copies", { variant: "error" });
                return;
            }

            // local pre-check to avoid unnecessary API call
            if (!storeDetails) {
                enqueueSnackbar("Store details not available", { variant: "error" });
                return;
            }

            if (Number(storeDetails.balance) < totalCost) {
                enqueueSnackbar("Insufficient store balance", { variant: "error" });
                return;
            }

            setLoading(true);

            /* ================== 1. WITHDRAW STORE BALANCE ================== */
            await axiosInstance.post(`/owner/stores/${storeId}/withdraw`, { amount: totalCost });

            /* ================== 2. CREATE BOOK ================== */
            const data = {
                title,
                author,
                publishYear,
                copies,
                description,
                genre: genres,
                price,
            };

            await axiosInstance.post(`/books`, data);

            enqueueSnackbar("Book created successfully", { variant: "success" });
            // refresh or navigate
            navigate("/store");

        } catch (err) {
            console.error(err.response?.data || err.message);

            enqueueSnackbar(
                err.response?.data?.message || "Error while creating book",
                { variant: "error" }
            );
        } finally {
            setLoading(false);
        }
    };

    const totalCost = Number(price) * Number(copies);

    return (
        <>
            <OwnerNavbar />
            <div className='p-4 ' >
                <BackButton destination='/store' />
                <h1 className='text-3xl mb-5 mt-0 text-center'>Create New Book</h1>
                <div className='flex flex-row justify-between'>

                    {loading ? <Spinner /> : ''}
                    <div className='createpage  flex flex-col  text-gray-400  w-[450px] rounded-lg '>
                        <div className='my-4 ' height="1px">
                            <label className='text-xl mr-1 text-black'>Title</label>
                            <input type="text" placeholder='Book Title' value={title} style={{ backgroundColor: "#8ec8ec4f" }} onChange={(e) => setTitle(e.target.value)} className='bg-white rounded-sm  border-black-500 px-4 py-2 w-full' />
                        </div>
                        <div className='my-1'>
                            <label className='text-xl mr-1 text-black'>Author</label>
                            <input type="text" value={author} placeholder='Author Name' style={{ backgroundColor: "#8ec8ec4f" }} onChange={(e) => setAuthor(e.target.value)} className='bg-white rounded-sm border-gray-500 px-4 py-2 w-full' />
                        </div>
                        <div className='my-1'>
                            <label className='text-xl mr-1 text-black'>Publish Year</label>
                            <input type="text" value={publishYear} style={{ backgroundColor: "#8ec8ec4f" }} placeholder="Publish Year" onChange={(e) => setPublishYear(e.target.value)} className='bg-white rounded-sm border-black-500 px-4 py-2 w-full' />
                        </div>
                        <div className="my-1">
                            <label className="text-xl mr-1 text-black">
                                Copies: <span className="font-semibold">{copies}</span>
                            </label>

                            <input
                                type="range"
                                min={1}
                                max={1000}
                                step={1}
                                value={copies}
                                onChange={(e) => setCopies(Number(e.target.value))}
                                className="w-full mt-2 accent-orange-600 rounded-sm"
                            />
                        </div>

                        <div className="my-1">
                            <label className="text-xl mr-1 text-black">Description</label>

                            <textarea
                                value={description}
                                placeholder="Book Description"
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-white  rounded-sm  px-4 py-2 w-full rounded-md"
                                rows={4}
                                style={{ backgroundColor: "#8ec8ec4f" }}
                            />
                        </div>
                        <div className="my-1">
                            <label className="text-xl mr-1 text-black block mb-2">
                                Genre
                            </label>

                            <div className="grid grid-cols-3 gap-3">
                                {genreOptions.map((genre) => (
                                    <label key={genre} className="flex items-center gap-2 text-black">
                                        <input
                                            type="checkbox"
                                            value={genre}
                                            checked={genres.includes(genre)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setGenres([...genres, genre])
                                                } else {
                                                    setGenres(genres.filter(g => g !== genre))
                                                }
                                            }}
                                        />
                                        <span>{genre}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className='my-1'>
                            <label className='text-xl mr-1 text-black'>MRP</label>
                            <input style={{ backgroundColor: "#8ec8ec4f" }} type="text" value={price} placeholder="Price/per copy" onChange={(e) => setPrice(e.target.value)} className='bg-white rounded-sm  border-black-500 px-4 py-2 w-full' />
                        </div>

                        <div style={{ marginTop: 8 }}>
                            <strong>Total cost:</strong> ₹{isNaN(totalCost) ? '0.00' : totalCost.toFixed(2)}
                            {storeDetails && Number(storeDetails.balance) < totalCost && (
                                <div style={{ color: '#c53030', marginTop: 6 }}>Insufficient store balance for this purchase</div>
                            )}
                        </div>

                        <button
                            className="p-2 m-2 w-[90px] text-white font-semibold rounded-xl transition-colors hover:scale-105 hover:text-black"
                            onClick={handleSaveBook}
                            disabled={loading || storeLoading || !storeDetails || Number(storeDetails?.balance || 0) < totalCost}
                            style={{ backgroundColor: (loading || storeLoading || !storeDetails || Number(storeDetails?.balance || 0) < totalCost) ? '#999' : '#ef4444' }}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                    <div className='flex flex-col'>

                        <div style={{ height: "50px " }} className='ml-3 text-2xl font-semibold'>Total Balance </div>
                        {storeLoading ? (
                            <span className=' text-white rounded-sm text-center p-2' style={{ backgroundColor: "#3df310ff", height: "40px", width: "200px" }}>Loading...</span>
                        ) : (
                            <span className=' text-white rounded-sm text-center p-2' style={{ backgroundColor: Number(storeDetails?.balance) >= (Number(price) * Number(copies) || 0) ? "#3df310ff" : "#ff6b6b", height: "40px", width: "200px" }}>
                                {storeDetails ? `₹${Number(storeDetails.balance).toFixed(2)}` : "No store"
                                }
                            </span>
                        )
                        }
                    </div>

                </div>





            </div>

        </>
    )
}
