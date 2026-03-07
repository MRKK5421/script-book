import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useBooks } from '../../contexts/books-context';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { books, getTotalWordCount } = useBooks();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  const userBooks = books.filter(book => book.userId === user?.id);
  const totalWordCount = getTotalWordCount();

  useEffect(() => {
    setEditedName(user?.name || '');
  }, [user]);

  const handleUpdateProfile = async () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please login to view your profile</h2>
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">My Profile</h1>
          <p className="text-gray-700 text-lg">Manage your account and view your writing progress</p>
        </div>

        {/* Profile Card */}
        <div className="glass-card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-bold text-white bg-white/10 border border-gray-300/50 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-amber-900 mb-2">{user.name}</h2>
                )}
                <p className="text-amber-700">{user.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-gray-200/20">
              <h3 className="text-lg font-semibold text-amber-700">Books Written</h3>
              <p className="text-3xl font-bold text-blue-400">{userBooks.length}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-gray-200/20">
              <h3 className="text-lg font-semibold text-amber-700">Total Words</h3>
              <p className="text-3xl font-bold text-green-400">{totalWordCount.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-gray-200/20">
              <h3 className="text-lg font-semibold text-amber-700">Member Since</h3>
              <p className="text-lg text-purple-400">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* User's Books */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-amber-900 mb-2">My Books</h3>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-300"
            >
              Create New Book
            </Link>
          </div>

          {userBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-700">No books yet</h3>
              <p className="text-gray-700 mb-6">Start your writing journey by creating your first book</p>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-300"
              >
                Create Your First Book
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBooks.map((book) => (
                <div key={book.id} className="glass-card hover:scale-105 transition-all duration-300">
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-2 truncate">{book.title}</h4>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {book.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{book.chapters.length} chapters</span>
                      <span>{book.totalWordCount.toLocaleString()} words</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/book/${book.id}`}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Open
                      </Link>
                      <Link
                        to={`/book/${book.id}/edit`}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
