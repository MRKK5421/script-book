import { useState } from 'react';
import { useBooks } from '../../contexts/books-context';
import { useAuth } from '../../contexts/auth-context';
import BookCard from '../../components/book-card';
import CreateBookModal from '../../components/create-book-modal';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { books } = useBooks();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const userBooks = books.filter(book => book.userId === user?.id);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-amber-900 mb-6">
            <span className="block">Your Literary</span>
            <span className="block bg-gradient-to-r from-amber-700 to-orange-800 bg-clip-text text-transparent">
              Writing Companion
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-amber-700 max-w-3xl mx-auto opacity-90">
            Write, edit, and organize your scripts in one beautiful, professional environment.
          </p>
        </div>

        {/* Create Book Button */}
        <div className="text-center mb-8">
          {user ? (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-700 to-orange-800 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create a New Book
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">Sign in to create and manage your books</p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 glass text-amber-800 font-medium rounded-xl hover:bg-amber-100/50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-700 to-orange-800 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Books Grid */}
        {userBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="glass-card max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-3">No books yet</h3>
              <p className="text-gray-300 mb-6">
                Get started by creating your first script book.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300"
              >
                Create Your First Book
              </button>
            </div>
          </div>
        )}

        {/* Create Book Modal */}
        <CreateBookModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
}
