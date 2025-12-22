import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../utlis/axiosinstance';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { useSnackbar } from 'notistack';
import OwnerNavbar from './Dashboards/OwnerNavbar';
import { UserContext } from '../context/userContext.jsx';

export default function CreateBook() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publishYear, setPublishYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [copies, setCopies] = useState(1);
    const [description, setDescription] = useState('');
    const [genres, setGenres] = useState([]);
    const [price, setPrice] = useState('');
    const [storeDetails, setStoreDetails] = useState(null);
    const [storeLoading, setStoreLoading] = useState(false);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useContext(UserContext);

    const genreOptions = ["Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Motivational", "Biography", "History", "Science", "Romance", "Thriller", "Mystery", "Horror"];

    useEffect(() => {
        const loadStore = async () => {
            if (!user || user.role !== 'Owner') return;
            setStoreLoading(true);
            try {
                const res = await axiosInstance.get('/stores/me');
                setStoreDetails(res.data);
            } catch (err) {
                console.error('Failed to load store details', err);
            } finally {
                setStoreLoading(false);
            }
        };
        loadStore();
    }, [user]);

    const totalCost = Number(price) * Number(copies);
    const isBalanceLow = storeDetails && Number(storeDetails.balance) < totalCost;

    const handleSaveBook = async () => {
        if (!storeDetails || isBalanceLow) {
            enqueueSnackbar("Check balance or store details", { variant: "error" });
            return;
        }

        try {
            setLoading(true);
            const storeId = storeDetails?._id || user?.store;
            await axiosInstance.post(`/owner/stores/${storeId}/withdraw`, { amount: totalCost });
            
            const data = { title, author, publishYear, copies, description, genre: genres, price };
            await axiosInstance.post(`/books`, data);

            enqueueSnackbar("Book created successfully", { variant: "success" });
            navigate("/store");
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || "Error while creating book", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <OwnerNavbar />
            <div className="p-6 max-w-6xl mx-auto">
                <BackButton destination='/store' />
                
                {/* Header Area */}
                <div className="flex justify-between items-end mb-8 mt-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">Add to Collection</h1>
                        <p className="text-slate-500 font-medium">Register a new title into your store inventory</p>
                    </div>
                    
                    {/* Wallet Component */}
                    <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Store Balance</p>
                        <p className={`text-2xl font-black ${isBalanceLow ? 'text-red-600' : 'text-slate-900'}`}>
                            {storeLoading ? '...' : `₹${Number(storeDetails?.balance || 0).toLocaleString()}`}
                        </p>
                    </div>
                </div>

                {loading && <Spinner />}

                {/* Main Form Boundary */}
                <div className="bg-white border border-slate-300 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
                    <div className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-slate-900 mb-2 ml-1">Book Title</label>
                                    <input type="text" placeholder="e.g. The Great Gatsby" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900" />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-slate-900 mb-2 ml-1">Author Name</label>
                                    <input type="text" placeholder="e.g. F. Scott Fitzgerald" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-slate-900 mb-2 ml-1">Publish Year</label>
                                        <input type="text" placeholder="2024" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-slate-900 mb-2 ml-1">Price (₹)</label>
                                        <input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900" />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-slate-900 mb-2 ml-1">Quantity: <span className="text-blue-600">{copies} units</span></label>
                                    <input type="range" min={1} max={1000} value={copies} onChange={(e) => setCopies(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900" />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-slate-900 mb-2 ml-1">Genre Selection</label>
                                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl max-h-[160px] overflow-y-auto">
                                        {genreOptions.map((genre) => (
                                            <label key={genre} className={`flex items-center px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all text-xs font-bold ${genres.includes(genre) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
                                                <input type="checkbox" className="hidden" checked={genres.includes(genre)} onChange={(e) => e.target.checked ? setGenres([...genres, genre]) : setGenres(genres.filter(g => g !== genre))} />
                                                {genre}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-slate-900 mb-2 ml-1">Brief Description</label>
                                    <textarea rows={4} placeholder="What is this book about?" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900 resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* Summary and Action Bar */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-left">
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Investment Summary</p>
                                <p className="text-3xl font-black text-slate-900">₹{totalCost.toLocaleString()}</p>
                                {isBalanceLow && <p className="text-red-500 text-xs font-bold mt-1">⚠️ You need ₹{(totalCost - storeDetails?.balance).toLocaleString()} more in balance</p>}
                            </div>

                            <div className="flex gap-4 w-full md:w-auto">
                                <button onClick={() => navigate('/store')} className="flex-1 md:px-8 py-4 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                                    Discard
                                </button>
                                <button 
                                    onClick={handleSaveBook} 
                                    disabled={loading || storeLoading || isBalanceLow}
                                    className={`flex-1 md:px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 ${isBalanceLow ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'}`}
                                >
                                    {loading ? 'Processing...' : 'Purchase & Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}