import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { useSnackbar } from 'notistack';
import "../App.css"
import SideView from '../components/SideView';
import OwnerNavbar from './Dashboards/OwnerNavbar';

export default function UpdateBook() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publishYear, setPublishYear] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const genreOptions = ["General", "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Motivational", "Biography", "History", "Science", "Romance", "Thriller", "Mystery", "Horror"]
    const [copies, setCopies] = useState('');
    const [description, setDescription] = useState('');
    const [genres, setGenres] = useState([])
    const [price, setPrice] = useState('');

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5555/books/${id}`)

            .then((res) => {
                const book = res.data;
                setTitle(book.title);
                setAuthor(book.author);
                setPublishYear(book.publishYear);
                setCopies(book.copies);
                setDescription(book.description);
                setGenres(book.genre || []);
                setPrice(book.price);
                setLoading(false);
                enqueueSnackbar('Book details loaded successfully', { variant: 'success' });
            }
            )
            .catch((err) => {

                enqueueSnackbar('Error while fetching book details', { variant: 'error' });
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleEditBook = () => {
        const data = { title, author, publishYear, copies, description, genre: genres, price };
        setLoading(true);
        const token = localStorage.getItem("token");

        axios.put(`http://localhost:5555/books/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }})
            .then((res) => {
                setLoading(false);
                enqueueSnackbar("Book Details Updated Successfully", {
          variant: "success",
        });
                navigate('/store');
            })
            .catch((err) => {
                enqueueSnackbar("Something Went Wrong", {
          variant: "error",
        });
                console.error(err);
                setLoading(false);
            });
    }
    return (
        <>
        <OwnerNavbar />
        <div className='p-4'>
            <BackButton />
            <h1 className='text-3xl my-4 text-center'>Edit Book</h1>
            {loading ? <Spinner /> : ''}
                <div className='createpage  flex flex-col  text-gray-400  w-[450px] rounded-lg '>
                    <div className='my-1'>
                        <label className='text-m mr-4 text-black'>Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{backgroundColor:"#8ec8ec4f"}}  className='rounded-sm text-gray bg-white  border-black-500 px-4 py-2 w-full' />
                    </div>
                    <div className='my-1'>
                        <label className='text-m mr-4 text-black'>Author</label>
                        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} style={{backgroundColor:"#8ec8ec4f"}} className='rounded-sm text-gray px-4   border-black-500  py-2 w-full' />
                    </div>
                    <div className='my-1'>
                        <label className='text-m mr-4 text-black'>Publish Year</label>
                        <input style={{backgroundColor:"#8ec8ec4f"}}  type="text" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} className="rounded-sm text-gray bg-white  border-black-500 px-4 py-2 w-full" />
                    </div>
                    <div className="my-1">
                        <label className="text-m mr-4 text-black">
                            Copies: <span className="font-semibold">{copies}</span>
                        </label>

                        <input
                            type="range"
                            min={1}
                            max={1000}
                            step={1}
                            value={copies}
                            onChange={(e) => setCopies(Number(e.target.value))}
                            className="w-full mt-2 accent-orange-600"
                            
                        />
                    </div>

                    <div className="my-1">
                        <label className="text-m mr-4 text-black">Description</label>

                        <textarea
                            value={description}
                            placeholder="Book Description"
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-white   px-4 py-2 w-full rounded-md"
                            rows={4}
                            style={{backgroundColor:"#8ec8ec4f"}} 
                            />
                    </div>
                    <div className="my-1">
                        <label className="text-m mr-4 text-black block mb-2">
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
                        <label className='text-m mr-4 text-black'>MRP</label>
                        <input type="text" value={price} style={{backgroundColor:"#8ec8ec4f"}}  placeholder="Price/per copy" onChange={(e) => setPrice(e.target.value)} className='bg-white  rounded-sm border-black-500 px-4 py-2 w-full' />
                    </div>
                    <button
                        className="p-2 m-2 w-[90px] text-white font-semibold rounded-xl
                        bg-red-500 hover:bg-red-700 transition-colors hover:scale-105 hover:text-black "
                        onClick={handleEditBook}
                        >
                        Save
                    </button>
                </div>
              
            
        </div>
                        </>
    )
}
