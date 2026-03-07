import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../../../contexts/books-context';

export default function EditPagePage() {
  const { bookId, chapterId, pageId } = useParams<{ bookId: string; chapterId: string; pageId: string }>();
  const { getBook, getChapter, updatePage } = useBooks();
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const book = getBook(bookId || '');
  const chapter = getChapter(bookId || '', chapterId || '');
  const page = chapter?.pages?.find(p => p.id === pageId);

  useEffect(() => {
    if (page) {
      setContent(page.content);
    }
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !bookId || !chapterId || !pageId) return;

    setIsLoading(true);
    try {
      updatePage(bookId, chapterId, pageId, {
        content: content.trim()
      });
      navigate(`/book/${bookId}/chapter/${chapterId}`);
    } catch (error) {
      console.error('Error updating page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!book || !chapter || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Page not found</h2>
          <button
            onClick={() => navigate(`/book/${bookId}/chapter/${chapterId}`)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Back to Chapter
          </button>
        </div>
      </div>
    );
  }

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Page</h1>
          <p className="text-gray-200 text-lg">
            Edit page content for "{chapter.title}" in "{book.title}"
          </p>
        </div>

        {/* Edit Form */}
        <div className="glass-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Page Info */}
            <div className="p-4 bg-white/5 rounded-lg border border-gray-200/20">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-white mb-1">Page Information</h3>
                  <p className="text-sm text-gray-300">Page {page.orderIndex + 1} • {wordCount} words</p>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(page.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-white mb-2">
                Page Content *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={20}
                className="w-full px-4 py-3 border border-gray-300/50 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/20 font-mono text-sm"
                placeholder="Enter your page content here..."
              />
            </div>

            {/* Word Count */}
            <div className="flex justify-between items-center text-sm text-gray-300">
              <span>Word count: {wordCount}</span>
              <span>Characters: {content.length}</span>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/20">
              <button
                type="button"
                onClick={() => navigate(`/book/${bookId}/chapter/${chapterId}`)}
                className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating...' : 'Update Page'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
