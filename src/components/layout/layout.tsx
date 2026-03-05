import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
