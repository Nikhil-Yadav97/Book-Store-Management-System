import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import OwnerNavbar from "./Dashboards/OwnerNavbar";

export default function DeleteBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [copiesToSell, setCopiesToSell] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5555/books/${id}`);
        setBook(res.data);
      } catch (err) {
        enqueueSnackbar("Error fetching book", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, enqueueSnackbar]);

  const handleDeleteBook = async () => {
    const sellCount = Number(copiesToSell);
    if (!sellCount || sellCount <= 0) {
      enqueueSnackbar("Enter valid quantity", { variant: "warning" });
      return;
    }

    const token = localStorage.getItem("token");
    const remainingCopies = book.copies - sellCount;

    try {
      setLoading(true);
      if (remainingCopies === 0) {
        await axios.delete(`http://localhost:5555/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        enqueueSnackbar("Stock cleared", { variant: "success" });
      } else {
        await axios.put(
          `http://localhost:5555/books/${id}/stock`,
          { copies: remainingCopies },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        enqueueSnackbar("Inventory updated", { variant: "success" });
      }
      navigate("/store");
    } catch (err) {
      enqueueSnackbar("Operation failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!book) return null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <OwnerNavbar />
      <div className="p-6">
        <BackButton destination="/store" />

        {/* Main Boundary Container */}
        <div className="max-w-md mx-auto mt-12 bg-white border border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden">
          
          <div className="p-8">
            {/* Header */}
            <header className="mb-8 border-b border-slate-100 pb-6 text-center">
              <h1 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-2">
                Inventory Action
              </h1>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                {book.title}
              </h2>
              <p className="text-slate-700 font-medium mt-1">
                by {book.author}
              </p>
            </header>

            {/* Info Section */}
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl mb-8 border border-slate-200">
              <span className="text-slate-900 font-bold">Current Stock</span>
              <span className="text-2xl font-black text-slate-900">{book.copies}</span>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-900 mb-2 ml-1">
                  Quantity to Sell
                </label>
                <input
                  type="number"
                  value={copiesToSell}
                  onChange={(e) => setCopiesToSell(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full text-lg font-bold p-4 border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:ring-0 transition-all outline-none text-slate-900 placeholder:text-slate-300"
                />
              </div>

              <button
                onClick={handleDeleteBook}
                className="w-full bg-slate-900 text-white text-lg font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg active:translate-y-1"
              >
                Confirm Sale
              </button>

              <button
                onClick={() => navigate("/store")}
                className="w-full text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors pt-2"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}