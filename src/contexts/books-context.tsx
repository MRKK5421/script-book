import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface Book {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  chapters: Chapter[];
  isPasswordProtected?: boolean;
  password?: string;
  theme?: string;
  totalWordCount: number;
  userId: string;
}

export interface Chapter {
  id: string;
  title: string;
  bookId: string;
  pages: Page[];
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  orderIndex: number;
}

export interface Page {
  id: string;
  chapterId: string;
  content: string;
  wordCount: number;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  autoSave: boolean;
  writingStreak: number;
}

type BooksContextType = {
  books: Book[];
  createBook: (title: string, description?: string, theme?: string, password?: string, userId?: string) => void;
  deleteBook: (id: string) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  getBook: (id: string) => Book | undefined;
  getChapter: (bookId: string, chapterId: string) => Chapter | undefined;
  addChapter: (bookId: string, title: string) => void;
  updateChapter: (bookId: string, chapterId: string, updates: Partial<Chapter>) => void;
  deleteChapter: (bookId: string, chapterId: string) => void;
  addPage: (chapterId: string, content: string) => Page;
  updatePage: (bookId: string, chapterId: string, pageId: string, updates: Partial<Page>) => void;
  deletePage: (bookId: string, chapterId: string, pageId: string) => void;
  getPage: (bookId: string, chapterId: string, pageId: string) => Page | undefined;
  createPage: (chapterId: string, content: string) => Page;
  getPages: (bookId: string, chapterId: string) => Page[];
  reorderPages: (bookId: string, chapterId: string, pages: Page[]) => void;
  searchBooks: (query: string) => Book[];
  getTotalWordCount: () => number;
  getRecentActivity: () => any[];
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
};

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    const savedBooks = localStorage.getItem('scriptbook-books');
    if (savedBooks) {
      try {
        const parsed = JSON.parse(savedBooks);
        return parsed.map((book: any) => ({
          ...book,
          createdAt: new Date(book.createdAt),
          updatedAt: new Date(book.updatedAt),
          chapters: book.chapters?.map((chapter: any) => ({
            ...chapter,
            createdAt: new Date(chapter.createdAt),
            updatedAt: new Date(chapter.updatedAt),
            pages: chapter.pages?.map((page: any) => ({
              ...page,
              createdAt: new Date(page.createdAt),
              updatedAt: new Date(page.updatedAt)
            })) || []
          })) || [],
          totalWordCount: book.totalWordCount || 0
        }));
      } catch (error) {
        console.error('Error loading books:', error);
      }
    }
    return [];
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('scriptbook-settings');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      fontSize: 'medium',
      fontFamily: 'Inter',
      autoSave: true,
      writingStreak: 0
    };
  });

  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scriptbook-books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('scriptbook-settings', JSON.stringify(userSettings));
  }, [userSettings]);

  const createBook = (title: string, description?: string, theme?: string, password?: string, userId?: string) => {
    const newBook: Book = {
      id: Date.now().toString(),
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      chapters: [],
      theme: theme || 'classic',
      isPasswordProtected: !!password,
      password,
      totalWordCount: 0,
      userId: userId || ''
    };
    setBooks(prev => [...prev, newBook]);
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id 
        ? { ...book, ...updates, updatedAt: new Date() }
        : book
    ));
  };

  const getBook = (id: string) => {
    return books.find(book => book.id === id);
  };

  const addChapter = (bookId: string, title: string) => {
    const book = getBook(bookId);
    const orderIndex = book ? book.chapters.length : 0;
    
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title,
      bookId,
      pages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 0,
      orderIndex
    };
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { ...book, chapters: [...book.chapters, newChapter], updatedAt: new Date() }
        : book
    ));
  };

  const deleteChapter = (bookId: string, chapterId: string) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { ...book, chapters: book.chapters.filter(ch => ch.id !== chapterId), updatedAt: new Date() }
        : book
    ));
  };

  const updateChapter = (bookId: string, chapterId: string, updates: Partial<Chapter>) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? {
            ...book,
            chapters: book.chapters.map(chapter => 
              chapter.id === chapterId 
                ? { ...chapter, ...updates, updatedAt: new Date() }
                : chapter
            ),
            updatedAt: new Date()
          }
        : book
    ));
  };

  const addPage = (chapterId: string, content: string): Page => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const orderIndex = 0; // Will be set properly when pages are sorted
    
    const newPage: Page = {
      id: Date.now().toString(),
      chapterId,
      content,
      wordCount,
      orderIndex,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setBooks(prev => prev.map(book => ({
      ...book,
      chapters: book.chapters.map(chapter => 
        chapter.id === chapterId 
          ? { 
              ...chapter, 
              pages: [...chapter.pages, newPage], 
              wordCount: chapter.wordCount + wordCount,
              updatedAt: new Date() 
            }
          : chapter
      ),
      totalWordCount: book.chapters.reduce((total, ch) => 
        ch.id === chapterId ? total + ch.wordCount + wordCount : total + ch.wordCount, 0
      ),
      updatedAt: new Date()
    })));
    
    return newPage;
  };

  const getChapter = (bookId: string, chapterId: string) => {
    const book = getBook(bookId);
    return book?.chapters.find(chapter => chapter.id === chapterId);
  };

  const updatePage = (bookId: string, chapterId: string, pageId: string, updates: Partial<Page>) => {
    setBooks(prev => prev.map(book => {
      if (book.id !== bookId) return book;
      
      return {
        ...book,
        chapters: book.chapters.map(chapter => {
          if (chapter.id !== chapterId) return chapter;
          
          return {
            ...chapter,
            pages: chapter.pages.map(page => 
              page.id === pageId 
                ? { ...page, ...updates, updatedAt: new Date() }
                : page
            ),
            updatedAt: new Date()
          };
        }),
        updatedAt: new Date()
      };
    }));
  };

  const deletePage = (bookId: string, chapterId: string, pageId: string) => {
    setBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          chapters: book.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              const deletedPage = chapter.pages.find(p => p.id === pageId);
              return {
                ...chapter,
                pages: chapter.pages.filter(page => page.id !== pageId),
                wordCount: deletedPage ? chapter.wordCount - deletedPage.wordCount : chapter.wordCount,
                updatedAt: new Date()
              };
            }
            return chapter;
          }),
          totalWordCount: book.chapters.reduce((total, chapter) => {
            if (chapter.id === chapterId) {
              const deletedPage = chapter.pages.find(p => p.id === pageId);
              return deletedPage ? total - deletedPage.wordCount : total;
            }
            return total;
          }, book.totalWordCount),
          updatedAt: new Date()
        };
      }
      return book;
    }));
  };

  const getPage = (bookId: string, chapterId: string, pageId: string): Page | undefined => {
    const book = books.find(b => b.id === bookId);
    if (!book) return undefined;
    
    const chapter = book.chapters.find(c => c.id === chapterId);
    if (!chapter) return undefined;
    
    return chapter.pages.find(p => p.id === pageId);
  };

  const createPage = (chapterId: string, content: string): Page => {
    const newPage: Page = {
      id: Date.now().toString(),
      chapterId,
      content,
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
      orderIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBooks(prev => prev.map(book => ({
      ...book,
      chapters: book.chapters.map(chapter => {
        if (chapter.id === chapterId) {
          const maxOrder = Math.max(...chapter.pages.map(p => p.orderIndex), -1);
          return {
            ...chapter,
            pages: [...chapter.pages, { ...newPage, orderIndex: maxOrder + 1 }],
            wordCount: chapter.wordCount + newPage.wordCount,
            updatedAt: new Date()
          };
        }
        return chapter;
      }),
      totalWordCount: book.totalWordCount + newPage.wordCount,
      updatedAt: new Date()
    })));

    return newPage;
  };

  const getPages = (bookId: string, chapterId: string): Page[] => {
    const book = books.find(b => b.id === bookId);
    if (!book) return [];
    
    const chapter = book.chapters.find(c => c.id === chapterId);
    if (!chapter) return [];
    
    return chapter.pages.sort((a, b) => a.orderIndex - b.orderIndex);
  };

  const reorderPages = (bookId: string, chapterId: string, reorderedPages: Page[]) => {
    setBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          chapters: book.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              return {
                ...chapter,
                pages: reorderedPages,
                updatedAt: new Date()
              };
            }
            return chapter;
          }),
          updatedAt: new Date()
        };
      }
      return book;
    }));
  };

  const searchBooks = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.description?.toLowerCase().includes(lowercaseQuery) ||
      book.chapters.some(chapter => 
        chapter.title.toLowerCase().includes(lowercaseQuery) ||
        chapter.pages.some(page => 
          page.content.toLowerCase().includes(lowercaseQuery)
        )
      )
    );
  };

  const getTotalWordCount = () => {
    return books.reduce((total, book) => total + book.totalWordCount, 0);
  };

  const getRecentActivity = () => {
    const activities: any[] = [];
    books.forEach(book => {
      book.chapters.forEach(chapter => {
        chapter.pages.forEach(page => {
          activities.push({
            type: 'page_updated',
            bookTitle: book.title,
            chapterTitle: chapter.title,
            timestamp: page.updatedAt,
            wordCount: page.wordCount
          });
        });
      });
    });
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...settings }));
  };

  const value = {
    books,
    createBook,
    deleteBook,
    updateBook,
    getBook,
    getChapter,
    addChapter,
    updateChapter,
    deleteChapter,
    addPage,
    updatePage,
    deletePage,
    getPage,
    createPage,
    getPages,
    reorderPages,
    searchBooks,
    getTotalWordCount,
    getRecentActivity,
    userSettings,
    updateUserSettings
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};
