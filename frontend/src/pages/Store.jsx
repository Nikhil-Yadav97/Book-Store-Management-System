import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Spinner from "../components/Spinner.jsx";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox } from "react-icons/md";
import BooksTable from "../components/home/BooksTable.jsx";
import BooksCard from "../components/home/BooksCard.jsx";
import { useSnackbar } from 'notistack'
import { MdOutlineDelete } from 'react-icons/md';
import NavBar from "../components/NavBar.jsx";
import BackButton from "../components/BackButton.jsx";
import OwnerNavbar from "./Dashboards/OwnerNavbar.jsx";
import { UserContext } from "../context/userContext";

function Store() {
  const [books, setBooks] = useState([]);
  const [storeDetails, setStoreDetails] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { user, loading: authLoading } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  useEffect(() => {
    // Wait until auth is resolved
    if (authLoading) return;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        // If logged-in owner with a store, request books for that store only
        const storeId = user?.store || null;
        const url = storeId ? `http://localhost:5555/books?storeId=${storeId}` : "http://localhost:5555/books";

        const res = await axios.get(url);
        setBooks(res.data.data);

        // If owner, also fetch the store details
        if (storeId) {
          const storeRes = await axios.get("http://localhost:5555/stores/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setStoreDetails(storeRes.data);
        }

      } catch (err) {
        console.error(err);
        enqueueSnackbar('Error while fetching books', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user, authLoading]);
  return (
    <>
      <OwnerNavbar />
      <div className="p-4">
        <BackButton destination='/dashboard' />
        {/* Show store header when owner has a store */}
        {storeDetails && (
          <div className="mb-4 text-center">
            <h2 className="text-4xl font-semibold rounded-sm" style={{ border: "" }}>{storeDetails.name}</h2>
            <p style={{ marginTop: 6, color: '#111010ff' }}>Available balance: <strong>₹{Number(storeDetails.balance).toFixed(2)}</strong></p>
          </div>
        )}
        <div className="flex justify-center items-center gap-x-4">
          <h1 className="font-semibold text-2xl">Views</h1>
          <button
            className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg font-semibold" onClick={() => setViewMode('table')}>Table</button>
          <button
            className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg font-semibold" onClick={() => setViewMode('card')}>Card</button>

        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-center font-semibold text-3xl my-8">Book List</h1>
          <Link to="/books/create" className="flex gap-4">
            <span className="text-xl mr-1 text-green-500 font-semibold mt-1.5">Add New Book</span>
            <MdOutlineAddBox className="text-4xl text-green-500" />
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : viewMode === 'table' ? (
          <BooksTable books={books} />
        ) : (
          <BooksCard books={books} />
        )
        }
      </div>
    </>
  );
}

export default Store;
