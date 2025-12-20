import React, { useState, useContext } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle } from 'react-icons/bi';
import axiosInstance from '../../utlis/axiosinstance';
import { UserContext } from '../../context/userContext.jsx';

const BookModal = ({ book, onClose, onPurchased }) => {
  return (
    <div
      className='fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center'
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='w-[600px] max-w-full h-[500px] bg-white rounded-xl p-4 flex flex-col relative'
      >
        <AiOutlineClose
          className='absolute right-6 top-6 text-3xl text-red-600 cursor-pointer'
          onClick={onClose}
        />
        <h2 className='w-fit px-4 py-1 bg-red-300 rounded-lg'>
          {book.publishYear}
        </h2>
        <h4 className='my-2 text-gray-500'>{book._id}</h4>
        <div className='flex justify-start items-center gap-x-2'>
          <PiBookOpenTextLight className='text-red-300 text-2xl' />
          <h2 className='my-1'>{book.title}</h2>
        </div>
        <div className='flex justify-start items-center gap-x-2'>
          <BiUserCircle className='text-red-300 text-2xl' />
          <h2 className='my-1'>{book.author}</h2>
        </div>
        <p className='font-semibold mt-4'>Book Description</p>
        <p className='my-2 rounded-sm ' style={{ backgroundColor: "#91d8ee66", height: "150px", padding: "10px", overflowY: "auto" }}>
          {book.description ? book.description : 'No Description Available'}
        </p>

        {/* Buy form for users */}
        <BuySection book={book} onClose={onClose} onPurchased={onPurchased} />
      </div>
    </div>
  );
};

const BuySection = ({ book, onClose, onPurchased }) => {
  const { user } = useContext(UserContext);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!user || user.role === "Owner") return null;

  const buy = async () => {
    try {
      setLoading(true);
      setMessage("");
      const res = await axiosInstance.post(`/books/${book._id}/buy`, { quantity: Number(qty) });
      setMessage(res.data.message || 'Purchase successful');
      if (onPurchased) onPurchased();
      // optional: close modal after purchase
      setTimeout(() => onClose && onClose(), 800);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className="border p-2 rounded" style={{ width: 100 }} />
        <button onClick={buy} disabled={loading} className='btn-primary text-white outlined bg-green-500 rounded-sm hover:bg-green-400' style={{ padding: '8px 12px' }}>
          {loading ? 'Processing...' : `Buy ₹${book.price}`}
        </button>
      </div>
      {message && <p style={{ marginTop: 8 }}>{message}</p>}
    </div>
  );
};

export default BookModal;