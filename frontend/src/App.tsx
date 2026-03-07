import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/auth-context';
import { BooksProvider } from './contexts/books-context';
import HomePage from './pages/home';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import DashboardPage from './pages/dashboard';
import ProfilePage from './pages/profile';
import BookPage from './pages/book';
import ChapterPage from './pages/chapter';
import CreateBookPage from './pages/books/new';
import EditBookPage from './pages/books/edit';
import EditChapterPage from './pages/chapters/edit';
import EditPagePage from './pages/pages/edit';
import ProtectedRoute from './components/protected-route';
import Layout from './components/layout/layout';
import NotFoundPage from './pages/404';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BooksProvider>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="books/new" element={
                  <ProtectedRoute>
                    <CreateBookPage />
                  </ProtectedRoute>
                } />
                <Route path="book/:bookId" element={<BookPage />} />
                <Route path="book/:bookId/edit" element={
                  <ProtectedRoute>
                    <EditBookPage />
                  </ProtectedRoute>
                } />
                <Route path="book/:bookId/chapter/:chapterId" element={<ChapterPage />} />
                <Route path="book/:bookId/chapter/:chapterId/edit" element={
                  <ProtectedRoute>
                    <EditChapterPage />
                  </ProtectedRoute>
                } />
                <Route path="book/:bookId/chapter/:chapterId/page/:pageId/edit" element={
                  <ProtectedRoute>
                    <EditPagePage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </div>
          <Toaster />
        </BooksProvider>
      </AuthProvider>
    </Router>
  );
}
export default App