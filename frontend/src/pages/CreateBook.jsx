import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { useSnackbar } from 'notistack';
import OwnerNavbar from './Dashboards/OwnerNavbar';
import "../App.css"

export default function CreateBook() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publishYear, setPublishYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [copies, setCopies] = useState('');
    const [description, setDescription] = useState('');
    const [genres, setGenres] = useState([])

    const [price, setPrice] = useState('');
    const navigate = useNavigate();
    const genreOptions = ["General", "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Motivational", "Biography", "History", "Science", "Romance", "Thriller", "Mystery", "Horror"]


    const { enqueueSnackbar } = useSnackbar();
    const handleSaveBook = (req,res) => {
        const data = {
            title,
            author,
            publishYear,
            copies,
            description,
            genre: genres,
            price,
            
        };

        const token = localStorage.getItem("token");

        setLoading(true);

        axios
            .post("http://localhost:5555/books", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                enqueueSnackbar("Book created successfully", { variant: "success" });
                navigate("/store");
            })
            .catch((err) => {
                console.error(err.response?.data || err.message);
                enqueueSnackbar("Error while creating book", { variant: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <OwnerNavbar />
            <div className='p-4 ' >
                <BackButton destination='/store' />
                <h1 className='text-3xl mb-5 mt-0 text-center'>Create New Book</h1>
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
                    <button
                        className="p-2 m-2 w-[90px] text-white font-semibold rounded-xl
                        bg-red-500 hover:bg-red-700 transition-colors hover:scale-105 hover:text-black "
                        onClick={handleSaveBook}
                    >
                        Save
                    </button>
                </div>




            </div>

        </>
    )
}
