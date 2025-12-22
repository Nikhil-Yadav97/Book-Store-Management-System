import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import OwnerNavbar from "./Dashboards/OwnerNavbar";
import UserNavBar from "./Dashboards/UserNavBar";
import { UserContext } from "../context/userContext";

export default function ShowBook() {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(UserContext);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5555/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBook(res.data);
      } catch (err) {
        enqueueSnackbar("Error while fetching book details", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, token, enqueueSnackbar]);

  const backDestination = user?.role === 'Owner' 
    ? `/owner/stores/${user?.store}/dashboard` 
    : `/user/store/${book.store}/books`;

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-slate-50">
      {user?.role === 'Owner' ? <OwnerNavbar /> : <UserNavBar />}
      
      <div className="p-6 max-w-5xl mx-auto">
        <BackButton destination={backDestination} />

        {/* Header Section */}
        <div className="mb-4 mt-3 text-center">
          <h1 className="text-4xl font-black text-slate-900">Book Information</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] mt-1">
            Detailed View & Statistics
          </p>
        </div>

        {/* Main Content Boundary */}
        <div className="bg-white border border-slate-300 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Left Column: Visual/Main Info */}
              <div className="md:col-span-1 border-r border-slate-100 pr-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database ID</label>
                    <p className="text-xs font-mono text-slate-500 break-all bg-slate-50 p-2 rounded mt-1 border border-slate-100">
                      {book._id}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-black text-slate-900 block mb-1">List Price</label>
                    <p className="text-4xl font-black text-slate-900">₹{book.price}</p>
                  </div>

                  <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">In-Store Inventory</label>
                    <p className="text-3xl font-black mt-1">{book.copies} <span className="text-sm font-medium opacity-80">Copies</span></p>
                  </div>
                </div>
              </div>

              {/* Right Column: Details Grid */}
              <div className="md:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DetailItem label="Title" value={book.title} highlight />
                  <DetailItem label="Author" value={book.author} />
                  <DetailItem label="Published" value={book.publishYear} />
                  <DetailItem 
                    label="Genres" 
                    value={
                      <div className="flex flex-wrap gap-2 mt-2">
                        {book.genre?.map((g, i) => (
                          <span key={i} className="bg-white border-2 border-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-900">
                            {g}
                          </span>
                        ))}
                      </div>
                    } 
                  />
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <label className="text-sm font-black text-slate-900 block mb-2">Description</label>
                  <p className="text-slate-600 leading-relaxed font-medium italic">
                    {book.description || "No specific summary provided for this title."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Added to System</label>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Inventory Sync</label>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      {book.updatedAt ? new Date(book.updatedAt).toLocaleDateString() : "-"}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for consistency
function DetailItem({ label, value, highlight = false }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <div className={`text-lg font-bold text-slate-900 ${highlight ? 'text-2xl font-black' : ''}`}>
        {value}
      </div>
    </div>
  );
}