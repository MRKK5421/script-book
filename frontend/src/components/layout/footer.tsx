import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-blue-600">
              ScriptBook
            </Link>
            <p className="text-sm text-gray-500 mt-1">Your digital script writing companion</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">
              About
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-blue-600 text-sm">
              Terms
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 text-sm">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ScriptBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}