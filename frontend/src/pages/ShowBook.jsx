import React, { useEffect } from 'react'
import axios from 'axios'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import { useParams } from 'react-router-dom'
import "../App.css"
import { useSnackbar } from 'notistack'
import OwnerNavbar from './Dashboards/OwnerNavbar'
export default function ShowBook() {
  const [book, setBook] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }})
      .then((res) => {
        setBook(res.data);
        setLoading(false);
        enqueueSnackbar('Book details loaded successfully', { variant: 'success' });
      }
      )
      .catch((err) => {
        console.error(err);
        setLoading(false);
        enqueueSnackbar('Error while fetching book details', { variant: 'error' });
      });
  }, []);
  return (
    <>
      <OwnerNavbar />
      <div className='p-4 '>
        <BackButton />
        <h1 className='text-3xl my-1 mb-3 text-center'>Book Details</h1>
        {loading ? <Spinner /> : (


          <div
            className="flex flex-col   rounded-xl createpage p-4"
            style={{ width: "400px" }}
          >
            <div className="my-1">
              <span className="text-xl mr-4 text-black">Book Id:</span>
              <span>{book._id}</span>
            </div>

            <div className="my-1">
              <span className="text-xl mr-4 text-black">Title:</span>
              <span>{book.title}</span>
            </div>

            <div className="my-1">
              <span className="text-xl mr-4 text-black">Author:</span>
              <span>{book.author}</span>
            </div>

            <div className="my-1">
              <span className="text-xl mr-4 text-black">Publisher Year:</span>
              <span>{book.publishYear}</span>
            </div>

            <div className="my-1">
              <span className="text-xl mr-4 text-black">Description:</span>
              <span>{book.description}</span>
            </div>

            <div className="my-1">
              <span className="text-xl mr-4 text-black">Genre:</span>
              {book.genre?.length > 0
                ? book.genre.map((g, index) => (
                  <span
                    key={index}
                    className="inline-block bg-green-200 text-blue-800 text-sm px-2 py-1 rounded-full mr-2"
                  >
                    {g}
                  </span>
                ))
                : <span>No genres available</span>}
            </div>

            <div className="my-1">
              <span className="text-xl mr-4 text-black">Price:</span>
              <span>{book.price}</span>
            </div>

            <div className="my-1">
              <span className="text-xl mr-4 text-black">Copies:</span>
              <span>{book.copies}</span>
            </div>

            <div className="my-1">
              <span className="text-xl mr-4 text-black">Created At:</span>
              <span>{new Date(book.createdAt).toLocaleString()}</span>
            </div>

            <div className="my-1">
              <span className="text-xl mr-4 text-black">Updated At:</span>
              <span>{new Date(book.updatedAt).toLocaleString()}</span>
            </div>
          </div>






        )}

      </div>
    </>
  )
}
