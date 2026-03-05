import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, useBooks } from '../contexts/books-context';

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  const { deleteBook } = useBooks();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    deleteBook(book.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="glass-card group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <div className="flex flex-col h-full">
        {/* Book Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-gray-300">
              {book.chapters?.length || 0} {book.chapters?.length === 1 ? 'chapter' : 'chapters'}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="ml-2 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete book"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Book Description */}
        {book.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-3">
            {book.description}
          </p>
        )}

        {/* Book Footer */}
        <div className="mt-auto pt-4 border-t border-gray-200/20">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {book.totalWordCount} words
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/book/${book.id}`)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-300"
              >
                Open Book
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => navigate(`/book/${book.id}/edit`)}
                className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-300"
                title="Edit Book"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0l2.828 2.828a2 2 0 010 2.828l-3.828 3.828z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-sm w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Delete Book</h3>
              <p className="text-gray-300">
                Are you sure you want to delete "{book.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
