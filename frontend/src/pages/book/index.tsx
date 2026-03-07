import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBooks } from '../../contexts/books-context';
import toast from 'react-hot-toast';

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const { getBook, addChapter } = useBooks();
  const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');
  const navigate = useNavigate();
  
  const book = getBook(id || '');

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (chapterTitle.trim()) {
      addChapter(id || '', chapterTitle.trim());
      setChapterTitle('');
      setIsCreateChapterOpen(false);
      toast.success('Chapter created successfully');
    }
  };

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Books
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-gray-500 mt-1">
                {book.chapters?.length || 0} {book.chapters?.length === 1 ? 'chapter' : 'chapters'}
              </p>
            </div>
            <button
              onClick={() => setIsCreateChapterOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chapter
            </button>
          </div>
        </div>

        {/* Chapters Grid */}
        {book.chapters && book.chapters.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {book.chapters.map((chapter) => (
              <div key={chapter.id} className="glass-card group cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Link to={`/books/${id}/chapters/${chapter.id}`} className="block">
                      <h3 className="text-lg font-semibold text-white mb-2 hover:text-blue-300 transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {chapter.pages?.length || 0} {chapter.pages?.length === 1 ? 'page' : 'pages'}
                      </p>
                    </Link>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/books/${id}/chapters/${chapter.id}/edit`)}
                      className="text-gray-400 hover:text-green-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit chapter"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0l2.828 2.828a2 2 0 010 2.828l-3.828 3.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Add delete chapter functionality
                        console.log('Delete chapter:', chapter.id);
                      }}
                      className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete chapter"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-card">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-white mb-3">No chapters yet</h3>
            <p className="mt-1 text-sm text-gray-300 mb-6">
              Get started by creating your first chapter.
            </p>
          </div>
        )}
        
        {/* Create Chapter Modal */}
        {isCreateChapterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Create New Chapter</h3>
              </div>
              
              <form onSubmit={handleCreateChapter} className="px-6 py-4">
                <div className="mb-4">
                  <label htmlFor="chapter-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Title
                  </label>
                  <input
                    id="chapter-title"
                    type="text"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter chapter title..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateChapterOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Chapter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
