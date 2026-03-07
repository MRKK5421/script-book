import React, { useState } from 'react';
import { useBooks } from '../contexts/books-context';
import { useAuth } from '../contexts/auth-context';

type CreateBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateBookModal({ isOpen, onClose }: CreateBookModalProps) {
  const [bookTitle, setBookTitle] = useState('');
  const { createBook } = useBooks();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookTitle.trim() && user) {
      createBook(bookTitle.trim(), undefined, undefined, undefined, user.id);
      setBookTitle('');
      onClose();
    }
  };

  const handleClose = () => {
    setBookTitle('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Create New Book</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label htmlFor="book-title" className="block text-sm font-medium text-gray-700 mb-2">
              Book Name
            </label>
            <input
              id="book-title"
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your book name..."
              autoFocus
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
