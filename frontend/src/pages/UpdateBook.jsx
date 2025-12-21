import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../utlis/axiosinstance";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSnackbar } from "notistack";
import "../App.css";
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
  const [storeLoading, setStoreLoading] = useState(false);
  const [oldInventoryValue, setOldInventoryValue] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(UserContext);

  const genreOptions = [
    "General", "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy",
    "Motivational", "Biography", "History", "Science",
    "Romance", "Thriller", "Mystery", "Horror"
  ];

  /* ================= LOAD BOOK & STORE ================= */
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

        const oldVal = Number(book.price || 0) * Number(book.copies || 0);
        setOldInventoryValue(oldVal);
      } catch (err) {
        enqueueSnackbar("Error loading book", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    const loadStore = async () => {
      if (!user || user.role !== "Owner") return;
      setStoreLoading(true);
      try {
        const res = await axiosInstance.get("/stores/me");
        setStoreDetails(res.data);
      } catch {
        // ignore
      } finally {
        setStoreLoading(false);
      }
    };

    loadBook();
    loadStore();
  }, [id, user]);

  /* ================= UPDATE BOOK ================= */
  const handleEditBook = async () => {
    const data = {
      title,
      author,
      publishYear,
      copies: Number(copies),
      description,
      genre: genres,
      price: Number(price),
    };

    try {
      setLoading(true);
      await axiosInstance.put(`/books/${id}`, data);
      enqueueSnackbar("Book updated successfully", { variant: "success" });
      navigate("/store");
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Update failed", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const newInventoryValue = Number(price || 0) * Number(copies || 0);
  const delta = newInventoryValue - oldInventoryValue;
  const insufficientBalance =
    delta > 0 && storeDetails && storeDetails.balance < delta;

  return (
    <>
      <OwnerNavbar />
      <div className="p-4">
        <BackButton />
        <h1 className="text-3xl my-4 text-center">Edit Book</h1>

        {loading && <Spinner />}

        {/* ================= FORM ================= */}
        <div className="w-[1100px] mx-auto bg-white rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Title */}
            <div>
              <label className="text-black">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-sm"
                style={{ backgroundColor: "#8ec8ec4f" }}
              />
            </div>

            {/* Author */}
            <div>
              <label className="text-black">Author</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 rounded-sm"
                style={{ backgroundColor: "#8ec8ec4f" }}
              />
            </div>

            {/* Publish Year */}
            <div>
              <label className="text-black">Publish Year</label>
              <input
                value={publishYear}
                onChange={(e) => setPublishYear(e.target.value)}
                className="w-full px-4 py-2 rounded-sm"
                style={{ backgroundColor: "#8ec8ec4f" }}
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-black">MRP</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 rounded-sm"
                style={{ backgroundColor: "#8ec8ec4f" }}
              />
            </div>

            {/* Copies */}
            <div className="md:col-span-2">
              <label className="text-black">
                Copies: <strong>{copies}</strong>
              </label>
              <input
                type="range"
                min={1}
                max={1000}
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
                className="w-full mt-2 accent-orange-600"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-black">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-md"
                style={{ backgroundColor: "#8ec8ec4f" }}
              />
            </div>

            {/* Genre */}
            <div className="md:col-span-2">
              <label className="text-black block mb-2">Genre</label>
              <div className="grid grid-cols-3 gap-3">
                {genreOptions.map((g) => (
                  <label key={g} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={genres.includes(g)}
                      onChange={(e) =>
                        e.target.checked
                          ? setGenres([...genres, g])
                          : setGenres(genres.filter((x) => x !== g))
                      }
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Inventory Summary */}
            <div className="md:col-span-2 p-4 bg-gray-100 rounded-md text-black">
              <div><strong>Old Inventory:</strong> ₹{oldInventoryValue}</div>
              <div><strong>New Inventory:</strong> ₹{newInventoryValue}</div>
              <div>
                <strong>Delta:</strong>{" "}
                <span className={delta > 0 ? "text-red-600" : "text-green-600"}>
                  {delta}
                </span>
              </div>
              {insufficientBalance && (
                <div className="text-red-600 mt-1">
                  Insufficient store balance
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="md:col-span-2 flex justify-center">
              <button
                onClick={handleEditBook}
                disabled={insufficientBalance}
                className={`px-6 py-2 rounded-xl text-white font-semibold transition
                  ${insufficientBalance
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-700 hover:scale-105"
                  }`}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
