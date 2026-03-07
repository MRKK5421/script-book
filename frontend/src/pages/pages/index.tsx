import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBooks } from '../../contexts/books-context';
import toast from 'react-hot-toast';

export default function PagesPage() {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const { getBook, getChapter, getPages, deletePage, reorderPages } = useBooks();
  const navigate = useNavigate();
  
  const [pages, setPages] = useState<any[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedPage, setDraggedPage] = useState<any>(null);

  const book = getBook(bookId || '');
  const chapter = getChapter(bookId || '', chapterId || '');

  useEffect(() => {
    if (chapter) {
      const chapterPages = getPages(bookId || '', chapterId || '');
      setPages(chapterPages || []);
    }
  }, [chapter, bookId, chapterId]);

  const handleDeletePage = (pageId: string) => {
    if (window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      deletePage(bookId || '', chapterId || '', pageId);
      toast.success('Page deleted successfully');
      setPages(pages.filter(p => p.id !== pageId));
    }
  };

  const handleDragStart = (page: any) => {
    setDraggedPage(page);
    setIsReordering(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPage: any) => {
    e.preventDefault();
    if (!draggedPage || draggedPage.id === targetPage.id) return;

    const newPages = [...pages];
    const draggedIndex = newPages.findIndex(p => p.id === draggedPage.id);
    const targetIndex = newPages.findIndex(p => p.id === targetPage.id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      newPages.splice(draggedIndex, 1);
      newPages.splice(targetIndex, 0, draggedPage);
      
      // Update order indices
      const reorderedPages = newPages.map((page, index) => ({
        ...page,
        orderIndex: index
      }));
      
      setPages(reorderedPages);
      reorderPages(bookId || '', chapterId || '', reorderedPages);
      toast.success('Page order updated');
    }

    setDraggedPage(null);
    setIsReordering(false);
  };

  const handleDragEnd = () => {
    setDraggedPage(null);
    setIsReordering(false);
  };

  if (!book || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Chapter not found</h2>
          <Link
            to={`/books/${bookId}`}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Back to Book
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link
                to={`/books/${bookId}`}
                className="inline-flex items-center text-sm text-amber-700 hover:text-amber-900 mb-4"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Book
              </Link>
              <h1 className="text-3xl font-bold text-amber-900">{chapter.title}</h1>
              <p className="text-amber-700">Pages ({pages.length})</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsReordering(!isReordering)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isReordering 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {isReordering ? 'Reordering...' : 'Reorder Pages'}
              </button>
              
              <Link
                to={`/editor/${bookId}/${chapterId}`}
                className="px-4 py-2 bg-gradient-to-r from-amber-700 to-orange-800 text-white rounded-lg hover:opacity-90 transition-all duration-300"
              >
                New Page
              </Link>
            </div>
          </div>
        </div>

        {/* Pages List */}
        {pages.length === 0 ? (
          <div className="glass-card text-center py-12">
            <svg className="w-16 h-16 mx-auto text-amber-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">No pages yet</h3>
            <p className="text-amber-700 mb-6">Start writing by creating your first page</p>
            <Link
              to={`/editor/${bookId}/${chapterId}`}
              className="px-6 py-3 bg-gradient-to-r from-amber-700 to-orange-800 text-white rounded-lg hover:opacity-90 transition-all duration-300"
            >
              Create First Page
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pages.map((page, index) => (
              <div
                key={page.id}
                draggable={isReordering}
                onDragStart={() => handleDragStart(page)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, page)}
                onDragEnd={handleDragEnd}
                className={`glass-card group cursor-pointer transform transition-all duration-300 ${
                  isReordering ? 'cursor-move opacity-75' : 'hover:scale-[1.02]'
                } ${draggedPage?.id === page.id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {isReordering && (
                        <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      )}
                      <span className="text-sm font-medium text-amber-700">Page {index + 1}</span>
                      <span className="mx-2 text-amber-400">•</span>
                      <span className="text-sm text-amber-600">
                        {page.wordCount || page.content.split(/\s+/).filter((w: string) => w.length > 0).length} words
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-amber-900 mb-2 line-clamp-2">
                      {page.content.split('\n')[0] || 'Untitled'}
                    </h3>
                    
                    <p className="text-amber-700 line-clamp-3 mb-4">
                      {page.content.substring(0, 200)}...
                    </p>
                    
                    <div className="flex items-center text-xs text-amber-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(page.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Link
                      to={`/editor/${bookId}/${chapterId}/${page.id}`}
                      className="p-2 text-amber-700 hover:text-amber-900 transition-colors"
                      title="Edit page"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0l2.828 2.828a2 2 0 010 2.828l-3.828 3.828z" />
                      </svg>
                    </Link>
                    
                    <button
                      onClick={() => navigate(`/books/${bookId}/chapters/${chapterId}/pages/${page.id}/edit`)}
                      className="p-2 text-amber-700 hover:text-amber-900 transition-colors"
                      title="Quick edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete page"
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
        )}

        {/* Reordering Instructions */}
        {isReordering && pages.length > 0 && (
          <div className="mt-6 p-4 bg-amber-100 rounded-lg border border-amber-200">
            <p className="text-amber-800 text-sm">
              <strong>Reordering mode:</strong> Drag and drop pages to reorder them. Click the "Reorder Pages" button again to finish.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
