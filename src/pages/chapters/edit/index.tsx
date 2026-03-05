import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../../../contexts/books-context';
import toast from 'react-hot-toast';

export default function EditChapterPage() {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const { getBook, getChapter, updateChapter } = useBooks();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const book = getBook(bookId || '');
  const chapter = getChapter(bookId || '', chapterId || '');

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title);
    }
  }, [chapter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !bookId || !chapterId) return;

    setIsLoading(true);
    try {
      updateChapter(bookId, chapterId, {
        title: title.trim()
      });
      toast.success('Chapter updated successfully');
      navigate(`/books/${bookId}/chapters/${chapterId}`);
    } catch (error) {
      console.error('Error updating chapter:', error);
      toast.error('Failed to update chapter');
    } finally {
      setIsLoading(false);
    }
  };

  if (!book || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Chapter not found</h2>
          <button
            onClick={() => navigate(`/books/${bookId}`)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Back to Book
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Chapter</h1>
          <p className="text-gray-200 text-lg">Update chapter details for "{book.title}"</p>
        </div>

        {/* Edit Form */}
        <div className="glass-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                Chapter Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300/50 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/20"
                placeholder="Enter chapter title"
              />
            </div>

            {/* Chapter Info */}
            <div className="p-4 bg-white/5 rounded-lg border border-gray-200/20">
              <h3 className="text-sm font-medium text-white mb-2">Chapter Information</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Pages: {chapter.pages?.length || 0}</p>
                <p>Word Count: {chapter.wordCount}</p>
                <p>Order: {chapter.orderIndex + 1}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/20">
              <button
                type="button"
                onClick={() => navigate(`/books/${bookId}/chapters/${chapterId}`)}
                className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating...' : 'Update Chapter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
