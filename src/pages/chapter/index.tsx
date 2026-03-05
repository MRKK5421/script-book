import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useBooks } from '../../contexts/books-context';
import toast from 'react-hot-toast';

export default function ChapterPage() {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const { getBook, getChapter, addPage } = useBooks();
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [pageContent, setPageContent] = useState('');
  
  const book = getBook(bookId || '');
  const chapter = getChapter(bookId || '', chapterId || '');

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (pageContent.trim()) {
      addPage(chapterId || '', pageContent.trim());
      setPageContent('');
      setIsCreatePageOpen(false);
      toast.success('Page created successfully');
    }
  };

  if (!book || !chapter) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chapter not found</h2>
        <Link
          to={`/books/${bookId}/chapters/${chapterId}/pages`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 mr-3"
        >
          View All Pages
        </Link>
        <Link
          to={`/books/${bookId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Book
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
            to={`/books/${bookId}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Book
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{chapter.title}</h1>
              <p className="text-gray-500 mt-1">
                {chapter.pages?.length || 0} {chapter.pages?.length === 1 ? 'page' : 'pages'}
              </p>
            </div>
            <button
              onClick={() => setIsCreatePageOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Page
            </button>
          </div>
        </div>

        {/* Pages Grid */}
        {chapter.pages && chapter.pages.length > 0 ? (
          <div className="space-y-6">
            {chapter.pages.map((page, index) => (
              <div key={page.id} className="glass-card">
                <Link to={`/editor/${bookId}/${chapterId}/${page.id}`} className="block">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">Page {index + 1}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              // TODO: Add edit page functionality
                              console.log('Edit page:', page.id);
                            }}
                            className="text-gray-400 hover:text-green-400 transition-colors"
                            title="Edit page"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0l2.828 2.828a2 2 0 010 2.828l-3.828 3.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              // TODO: Add delete page functionality
                              console.log('Delete page:', page.id);
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete page"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="prose prose max-w-none">
                      <p className="text-gray-300 whitespace-pre-wrap">{page.content}</p>
                    </div>
                  </div>
                </Link>
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
            <h3 className="mt-2 text-sm font-medium text-white mb-3">No pages yet</h3>
            <p className="mt-1 text-sm text-gray-300 mb-6">
              Get started by creating your first page in this chapter.
            </p>
          </div>
        )}
        
        {/* Create Page Modal */}
        {isCreatePageOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Create New Page</h3>
              </div>
              
              <form onSubmit={handleCreatePage} className="px-6 py-4">
                <div className="mb-4">
                  <label htmlFor="page-content" className="block text-sm font-medium text-gray-700 mb-2">
                    Page Content
                  </label>
                  <textarea
                    id="page-content"
                    value={pageContent}
                    onChange={(e) => setPageContent(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Start writing your script content here..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatePageOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Page
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
