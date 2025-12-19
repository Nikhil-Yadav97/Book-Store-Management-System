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

  /* =========================
     FETCH BOOK DETAILS
     ========================= */
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5555/books/${id}`);
        setBook(res.data); // 🔑 FIXED
      } catch (err) {
        enqueueSnackbar("Error while fetching book details", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, enqueueSnackbar]);

  /* =========================
     SELL / DELETE LOGIC
     ========================= */
  const handleDeleteBook = async () => {
    const sellCount = Number(copiesToSell);

    if (!sellCount || sellCount <= 0) {
      enqueueSnackbar("Enter a valid number of copies", {
        variant: "warning",
      });
      return;
    }

    if (sellCount > book.copies) {
      enqueueSnackbar("Cannot sell more copies than available", {
        variant: "error",
      });
      return;
    }

    const token = localStorage.getItem("token");
    const remainingCopies = book.copies - sellCount;

    try {
      setLoading(true);

      // 🔴 DELETE BOOK IF STOCK ZERO
      if (remainingCopies === 0) {
        await axios.delete(`http://localhost:5555/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        enqueueSnackbar("Book sold out and removed", {
          variant: "success",
        });
      }
     
      else {
        await axios.put(
          `http://localhost:5555/books/${id}/stock`,
          { copies: remainingCopies },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        enqueueSnackbar(`${sellCount} copies sold successfully`, {
          variant: "success",
        });
      }

      navigate("/store");
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || "Operation failed",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  if (!book) return null;

  return (
    <>
      <OwnerNavbar />

      <div className="p-4">
        <BackButton destination="/store" />

        <h1 className="text-3xl my-4 text-center">Stock Clearance</h1>

        <div className="flex flex-col border-2 rounded-xl w-[500px] p-4 mx-auto">
          <span className="text-center text-xl text-red-600">
            Enter No Of Books To Sell
          </span>

          <span className="mt-6 font-semibold">Book: {book.title}</span>
          <span className="mt-2 font-semibold">Author: {book.author}</span>

          <label className="mt-4">
            Available Copies: {book.copies}
          </label>

          <input
            type="number"
            min="1"
            value={copiesToSell}
            onChange={(e) => setCopiesToSell(e.target.value)}
            className="mt-2 text-center rounded-sm"
            style={{
              backgroundColor: "#3282f14b",
              height: "34px",
              width: "90px",
            }}
          />

          <button
            className="p-2 bg-red-500 text-white mt-6 w-32 mx-auto rounded-sm hover:bg-red-600 transition"
            onClick={handleDeleteBook}
          >
            Sell
          </button>
        </div>
      </div>
    </>
  );
}
