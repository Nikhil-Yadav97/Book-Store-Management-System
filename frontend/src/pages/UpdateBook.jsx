import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../utlis/axiosinstance";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSnackbar } from "notistack";
import OwnerNavbar from "./Dashboards/OwnerNavbar";
import { UserContext } from "../context/userContext.jsx";

export default function UpdateBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [copies, setCopies] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState([]);
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [storeDetails, setStoreDetails] = useState(null);
  const [oldInventoryValue, setOldInventoryValue] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(UserContext);

  const genreOptions = ["Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Motivational", "Biography", "History", "Science", "Romance", "Thriller", "Mystery", "Horror"];

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/books/${id}`);
        const book = res.data;
        setTitle(book.title);
        setAuthor(book.author);
        setPublishYear(book.publishYear);
        setCopies(book.copies);
        setDescription(book.description);
        setGenres(book.genre || []);
        setPrice(book.price);
        setOldInventoryValue(Number(book.price || 0) * Number(book.copies || 0));
      } catch (err) {
        enqueueSnackbar("Error loading book", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    const loadStore = async () => {
      if (!user || user.role !== "Owner") return;
      try {
        const res = await axiosInstance.get("/stores/me");
        setStoreDetails(res.data);
      } catch (err) { console.error(err); }
    };

    loadBook();
    loadStore();
  }, [id, user, enqueueSnackbar]);

  const handleEditBook = async () => {
    const data = { title, author, publishYear, copies: Number(copies), description, genre: genres, price: Number(price) };
    try {
      setLoading(true);
      await axiosInstance.put(`/books/${id}`, data);
      enqueueSnackbar("Book updated successfully", { variant: "success" });
      navigate("/store");
    } catch (err) {
      enqueueSnackbar("Update failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const newInventoryValue = Number(price || 0) * Number(copies || 0);
  const delta = newInventoryValue - oldInventoryValue;
  const insufficientBalance = delta > 0 && storeDetails && storeDetails.balance < delta;

  return (
    <div className="min-h-screen bg-slate-50">
      <OwnerNavbar />
      <div className="p-6 max-w-6xl mx-auto">
        <BackButton destination="/store" />

        {/* Header Area */}
        <div className="flex justify-between items-end mb-8 mt-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Update Title</h1>
            <p className="text-slate-500 font-medium">Modify inventory details and book metadata</p>
          </div>
          
          <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Balance</p>
            <p className={`text-2xl font-black ${insufficientBalance ? 'text-red-600' : 'text-slate-900'}`}>
              ₹{Number(storeDetails?.balance || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {loading && <Spinner />}

        {/* Main Boundary Container */}
        <div className="bg-white border border-slate-300 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden mb-10">
          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                <InputGroup label="Book Title" value={title} onChange={setTitle} />
                <InputGroup label="Author" value={author} onChange={setAuthor} />
                
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Year" value={publishYear} onChange={setPublishYear} />
                  <InputGroup label="Price (₹)" value={price} onChange={setPrice} type="number" />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-black text-slate-900 mb-2 ml-1 flex justify-between">
                    Stock Level <span>{copies} Units</span>
                  </label>
                  <input type="range" min={1} max={1000} value={copies} onChange={(e) => setCopies(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-sm font-black text-slate-900 mb-2 ml-1">Genres</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl max-h-[160px] overflow-y-auto">
                    {genreOptions.map((g) => (
                      <label key={g} className={`px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all text-xs font-black ${genres.includes(g) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <input type="checkbox" className="hidden" checked={genres.includes(g)} onChange={(e) => e.target.checked ? setGenres([...genres, g]) : setGenres(genres.filter(x => x !== g))} />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-black text-slate-900 mb-2 ml-1">Editorial Description</label>
                  <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900 resize-none" />
                </div>
              </div>
            </div>

            {/* Bottom Summary & Actions */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-8">
                <SummaryItem label="Old Valuation" value={oldInventoryValue} color="text-slate-400" />
                <SummaryItem label="New Valuation" value={newInventoryValue} color="text-slate-900" />
                <SummaryItem label="Inventory Delta" value={delta} color={delta > 0 ? "text-red-600" : "text-green-600"} prefix={delta > 0 ? "+" : ""} />
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <button onClick={() => navigate('/store')} className="flex-1 md:px-8 py-4 text-slate-500 font-bold hover:text-slate-900 transition-colors">Cancel</button>
                <button 
                  onClick={handleEditBook} 
                  disabled={loading || insufficientBalance}
                  className={`flex-1 md:px-12 py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all ${insufficientBalance ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'}`}
                >
                  {loading ? 'Saving...' : 'Update Inventory'}
                </button>
              </div>
            </div>
            {insufficientBalance && <p className="text-red-600 text-right text-xs font-bold mt-2">⚠️ Adjustment exceeds store balance</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for clean code
const InputGroup = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-sm font-black text-slate-900 mb-2 ml-1">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900" />
  </div>
);

const SummaryItem = ({ label, value, color, prefix = "" }) => (
  <div className="text-center md:text-left">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
    <p className={`text-lg font-black ${color}`}>{prefix}₹{Math.abs(value).toLocaleString()}</p>
  </div>
);