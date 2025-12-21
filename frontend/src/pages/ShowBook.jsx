import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";
import "../App.css";
import { useSnackbar } from "notistack";
import OwnerNavbar from "./Dashboards/OwnerNavbar";
import UserNavBar from "./Dashboards/UserNavBar";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function ShowBook() {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5555/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBook(res.data);
        enqueueSnackbar("Book details loaded successfully", { variant: "success" });
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Error while fetching book details", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const { user } = useContext(UserContext);

  const backDestination = user?.role === 'Owner' ? `/owner/stores/${user?.store}/dashboard` : `/user/store/${book.store}/books`;

  return (
    <>
      {user?.role === 'Owner' ? <OwnerNavbar /> : <UserNavBar />}
      <div className="p-4">
        <BackButton destination={backDestination} />
        <h1 className="text-3xl my-4 text-center">Book Details</h1>

        {loading ? (
          <Spinner />
        ) : (
          <div className="max-w-4xl mx-auto  rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#87e7e739" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">

              {/* Book ID */}
              <div>
                <span className="font-semibold">Book ID</span>
                <p className="text-gray-900 break-all">{book._id}</p>
              </div>

              {/* Title */}
              <div>
                <span className="font-semibold">Title</span>
                <p className="text-gray-700">{book.title}</p>
              </div>

              {/* Author */}
              <div>
                <span className="font-semibold">Author</span>
                <p className="text-gray-700">{book.author}</p>
              </div>

              {/* Publish Year */}
              <div>
                <span className="font-semibold">Publish Year</span>
                <p className="text-gray-700">{book.publishYear}</p>
              </div>

              {/* Price */}
              <div>
                <span className="font-semibold">Price</span>
                <p className="text-gray-700">₹{book.price}</p>
              </div>

              {/* Copies */}
              <div>
                <span className="font-semibold">Copies</span>
                <p className="text-gray-700">{book.copies}</p>
              </div>

              {/* Description (FULL WIDTH) */}
              <div className="md:col-span-2">
                <span className="font-semibold">Description</span>
                <p className="text-gray-700 mt-1">
                  {book.description || "No description available"}
                </p>
              </div>

              {/* Genre (FULL WIDTH) */}
              <div className="md:col-span-2">
                <span className="font-semibold">Genres</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {book.genre?.length > 0 ? (
                    book.genre.map((g, index) => (
                      <span
                        key={index}
                        className="bg-green-200 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No genres available</span>
                  )}
                </div>
              </div>

              {/* Created At */}
              <div>
                <span className="font-semibold">Created At</span>
                <p className="text-gray-700">
                  {book.createdAt
                    ? new Date(book.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              {/* Updated At */}
              <div>
                <span className="font-semibold">Updated At</span>
                <p className="text-gray-700">
                  {book.updatedAt
                    ? new Date(book.updatedAt).toLocaleString()
                    : "-"}
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
}
