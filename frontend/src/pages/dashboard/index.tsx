import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../../contexts/books-context';
import { useAuth } from '../../contexts/auth-context';
import BookCard from '../../components/book-card';

export default function DashboardPage() {
  const { books, getTotalWordCount, getRecentActivity } = useBooks();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const userBooks = books.filter(book => book.userId === user?.id);
  
  const filteredBooks = searchQuery 
    ? userBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : userBooks;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const quickStats = {
    totalBooks: userBooks.length,
    totalWords: getTotalWordCount(),
    writingStreak: 7, // This would come from userSettings
    recentlyActive: userBooks.filter(book => 
      new Date().getTime() - book.updatedAt.getTime() < 7 * 24 * 60 * 60 * 1000
    ).length
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Dashboard</h1>
          <p className="text-amber-700 text-lg">Manage your script writing projects</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-amber-600 rounded-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-lg font-semibold text-amber-700">Total Books</p>
                <p className="text-2xl font-bold text-amber-900">{quickStats.totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="glass-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-green-600 rounded-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2v5a2 2 0 002 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-lg font-semibold text-amber-700">Total Words</p>
                <p className="text-2xl font-bold text-amber-900">{quickStats.totalWords.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="glass-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-600 rounded-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3l-3 3m6-3v-4m0 4v6m6-3l-3 3m6-3v-4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-lg font-semibold text-amber-700">Writing Streak</p>
                <p className="text-2xl font-bold text-amber-900">{quickStats.writingStreak} days</p>
              </div>
            </div>
          </div>

          <div className="glass-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-600 rounded-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3l-3 3m6-3v-4m0 4v6m6-3l-3 3m6-3v-4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-lg font-semibold text-amber-700">Recently Active</p>
                <p className="text-2xl font-bold text-amber-900">{quickStats.recentlyActive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Create Section */}
        <div className="glass-card mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  className="w-full pl-10 pr-4 py-3 border border-amber-900/30 rounded-lg bg-amber-50/20 backdrop-blur-sm text-amber-900 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-amber-100/50"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0l-3 3m0 0l-3 3" />
                  </svg>
                </div>
              </div>
            </div>
            <Link
              to="/books/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-700 to-orange-800 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Book
            </Link>
          </div>
        </div>

        {/* Books Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">Your Books</h2>
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="glass-card max-w-md mx-auto">
                <svg className="mx-auto h-16 w-16 text-amber-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0l9.172-9.172a4 4 0 01-5.656 0L9.172 7.828a4 4 0 010.586 0L4.414 12.586a4 4 0 010.586 0L9.172 16.172z" />
                </svg>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">
                  {searchQuery ? 'No books found' : 'No books yet'}
                </h3>
                <p className="text-amber-600 mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Get started by creating your first book'
                  }
                </p>
                {!searchQuery && (
                  <Link
                    to="/books/new"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-700 to-orange-800 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300"
                  >
                    Create your first book
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-card">
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">Recent Activity</h2>
          {getRecentActivity().length > 0 ? (
            <div className="space-y-3">
              {getRecentActivity().map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-amber-900/20 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">
                      {activity.type === 'page_updated' ? 'Updated page' : 'Activity'} in "{activity.chapterTitle}"
                    </p>
                    <p className="text-xs text-amber-600">
                      {activity.bookTitle} • {formatDate(activity.timestamp)}
                    </p>
                  </div>
                  <div className="text-sm text-amber-600">
                    {activity.wordCount} words
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3l-3 3m6-3v-4m0 4v6m6-3l-3 3m6-3v-4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-amber-900">No recent activity</h3>
              <p className="mt-1 text-sm text-amber-600">Start writing to see your activity here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}