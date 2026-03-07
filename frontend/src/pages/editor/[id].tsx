import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../../contexts/books-context';
import { useAuth } from '../../contexts/auth-context';
import toast from 'react-hot-toast';

export default function EditorPage() {
  const { bookId, chapterId, pageId } = useParams<{ bookId: string; chapterId: string; pageId: string }>();
  const { getBook, getChapter, getPage, updatePage, createPage } = useBooks();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const book = getBook(bookId || '');
  const chapter = getChapter(bookId || '', chapterId || '');
  const page = pageId ? getPage(bookId || '', chapterId || '', pageId || '') : null;

  useEffect(() => {
    if (page) {
      setContent(page.content);
      setWordCount(page.content.split(/\s+/).filter((word: string) => word.length > 0).length);
    }
  }, [page]);

  useEffect(() => {
    const words = content.split(/\s+/).filter((word: string) => word.length > 0).length;
    setWordCount(words);
  }, [content]);

  useEffect(() => {
    if (autoSaveEnabled && content && pageId) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 3000); // Auto-save after 3 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [content, autoSaveEnabled]);

  const handleAutoSave = async () => {
    if (!content.trim() || !bookId || !chapterId || !pageId) return;
    
    try {
      await updatePage(bookId, chapterId, pageId, {
        content: content.trim()
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Please write some content before saving');
      return;
    }

    setIsSaving(true);
    try {
      if (pageId && page) {
        // Update existing page
        await updatePage(bookId || '', chapterId || '', pageId, {
          content: content.trim()
        });
        toast.success('Page saved successfully');
      } else {
        // Create new page
        const newPage = await createPage(chapterId || '', content.trim());
        toast.success('Page created successfully');
        navigate(`/editor/${bookId}/${chapterId}/${newPage.id}`);
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'untitled'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Content exported successfully');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    
    // Ctrl/Cmd + E to export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      handleExport();
    }
    
    // Ctrl/Cmd + F to toggle fullscreen
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  if (!book || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Content not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isFullscreen && (
                <button
                  onClick={() => navigate(`/books/${bookId}/chapters/${chapterId}`)}
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-amber-900">{book.title}</h1>
                <p className="text-sm text-amber-700">{chapter.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Word Count */}
              <div className="text-sm text-amber-700">
                <span className="font-medium">{wordCount}</span> words
              </div>
              
              {/* Auto-save indicator */}
              <div className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded ${autoSaveEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                </label>
                <span className="text-xs text-amber-600">
                  {autoSaveEnabled ? 'Auto-save on' : 'Auto-save off'}
                </span>
              </div>
              
              {/* Last saved */}
              {lastSaved && (
                <span className="text-xs text-amber-600">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExport}
                  className="p-2 text-amber-700 hover:text-amber-900 transition-colors"
                  title="Export (Ctrl+E)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-amber-700 hover:text-amber-900 transition-colors"
                  title="Toggle Fullscreen (Ctrl+F)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-amber-700 to-orange-800 text-white rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                  title="Save (Ctrl+S)"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className={`${isFullscreen ? 'h-full' : 'min-h-screen'} bg-gradient-to-br from-amber-50 to-orange-50`}>
        <div className={`${isFullscreen ? 'h-full' : 'py-8'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card">
              {/* Title Input */}
              <div className="mb-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter page title..."
                  className="w-full text-3xl font-bold bg-transparent border-none outline-none text-amber-900 placeholder-amber-400"
                />
              </div>
              
              {/* Content Editor */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Start writing your story here..."
                  className={`w-full min-h-[500px] bg-transparent border-none outline-none resize-none text-amber-900 placeholder-amber-400 leading-relaxed ${isFullscreen ? 'h-full' : ''}`}
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '16px',
                    lineHeight: '1.8'
                  }}
                />
                
                {/* Character count at bottom */}
                <div className="absolute bottom-4 right-4 text-xs text-amber-600">
                  {content.length} characters
                </div>
              </div>
            </div>
            
            {/* Keyboard Shortcuts Help */}
            {!isFullscreen && (
              <div className="mt-6 text-center text-sm text-amber-600">
                <p>Keyboard shortcuts: <kbd className="px-2 py-1 bg-amber-100 rounded">Ctrl+S</kbd> Save • <kbd className="px-2 py-1 bg-amber-100 rounded">Ctrl+E</kbd> Export • <kbd className="px-2 py-1 bg-amber-100 rounded">Ctrl+F</kbd> Fullscreen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}