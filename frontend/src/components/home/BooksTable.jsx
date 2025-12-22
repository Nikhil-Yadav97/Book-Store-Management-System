import React from 'react';
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from 'react-icons/md';

export default function BooksTable({ books }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-slate-200">
      <table className="w-full text-left border-collapse bg-white">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 font-semibold text-slate-700">No</th>
            <th className="px-6 py-4 font-semibold text-slate-700">Title</th>
            <th className="px-6 py-4 font-semibold text-slate-700 max-md:hidden">Author</th>
            <th className="px-6 py-4 font-semibold text-slate-700 max-md:hidden">Publish Year</th>
            <th className="px-6 py-4 font-semibold text-slate-700 max-md:hidden text-center">Copies</th>
            <th className="px-6 py-4 font-semibold text-slate-700 max-md:hidden">Price</th>
            <th className="px-6 py-4 font-semibold text-slate-700 text-center">Operations</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {books.map((book, index) => (
            <tr 
              key={book._id} 
              className="hover:bg-blue-50/50 transition-colors duration-200 group"
            >
              <td className="px-6 py-4 text-slate-500 font-medium">
                {index + 1}
              </td>
              <td className="px-6 py-4 text-slate-900 font-semibold">
                {book.title}
              </td>
              <td className="px-6 py-4 text-slate-600 max-md:hidden">
                {book.author}
              </td>
              <td className="px-6 py-4 text-slate-500 max-md:hidden">
                <span className="bg-slate-100 px-2 py-1 rounded-md text-sm">
                  {book.publishYear}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600 max-md:hidden text-center">
                {book.copies}
              </td>
              <td className="px-6 py-4 text-slate-900 font-bold max-md:hidden">
                ${book.price}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-x-3">
                  <Link 
                    to={`/books/details/${book._id}`}
                    className="p-2 rounded-lg hover:bg-green-100 transition-colors"
                    title="Details"
                  >
                    <BsInfoCircle className="text-xl text-green-700" />
                  </Link>
                  <Link 
                    to={`/books/edit/${book._id}`}
                    className="p-2 rounded-lg hover:bg-yellow-100 transition-colors"
                    title="Edit"
                  >
                    <AiOutlineEdit className="text-xl text-yellow-700" />
                  </Link>
                  <Link 
                    to={`/books/delete/${book._id}`}
                    className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <MdOutlineDelete className="text-xl text-red-600" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}