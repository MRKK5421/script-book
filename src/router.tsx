// src/router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import { BooksProvider } from './contexts/books-context';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/home';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import DashboardPage from './pages/dashboard';
import NewBookPage from './pages/books/new';
import BookPage from './pages/book/index';
import EditBookPage from './pages/books/edit/index';
import ChapterPage from './pages/chapter/index';
import EditChapterPage from './pages/chapters/edit/index';
import SettingsPage from './pages/settings';
import EditorPage from './pages/editor/[id]';
import PagesPage from './pages/pages';
import ProtectedRoute from './components/protected-route';
import Layout from './components/layout/layout';
import NotFoundPage from './pages/404';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'books/new',
        element: (
          <ProtectedRoute>
            <NewBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'books/:id',
        element: (
          <ProtectedRoute>
            <BookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'books/:id/edit',
        element: (
          <ProtectedRoute>
            <EditBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'books/:bookId/chapters/:chapterId',
        element: (
          <ProtectedRoute>
            <ChapterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'books/:bookId/chapters/:chapterId/edit',
        element: (
          <ProtectedRoute>
            <EditChapterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'editor/:bookId/:chapterId/:pageId?',
        element: (
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'books/:bookId/chapters/:chapterId/pages',
        element: (
          <ProtectedRoute>
            <PagesPage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export function Router() {
  return (
    <AuthProvider>
      <BooksProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </BooksProvider>
    </AuthProvider>
  );
}