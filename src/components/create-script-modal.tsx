import { useState } from 'react';
import { useBooks } from '../contexts/books-context';

type CreateScriptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
};

export default function CreateScriptModal({ isOpen, onClose, bookId }: CreateScriptModalProps) {
  const [scriptTitle, setScriptTitle] = useState('');
  const { createBook } = useBooks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scriptTitle.trim()) {
      // TODO: Implement create script functionality
      console.log('Creating script:', scriptTitle, 'in book:', bookId);
      setScriptTitle('');
      onClose();
    }
  };

  const handleClose = () => {
    setScriptTitle('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Create New Script</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label htmlFor="script-title" className="block text-sm font-medium text-gray-700 mb-2">
              Script Title
            </label>
            <input
              id="script-title"
              type="text"
              value={scriptTitle}
              onChange={(e) => setScriptTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your script title..."
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
              Create Script
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
