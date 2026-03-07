import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/20 backdrop-blur-md bg-gradient-to-r from-amber-50/90 to-orange-50/90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-800 bg-clip-text text-transparent hover:opacity-90 transition-all duration-300">
            <span className="flex items-center">
              📚
              <span className="ml-2">ScriptBook</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <div className="relative">
              <button className="md:hidden p-2 rounded-lg glass hover:bg-gray-200/50 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Mobile Menu */}
              <div className="absolute top-full left-0 w-full glass p-4 rounded-b-2xl shadow-2xl md:hidden">
                <div className="flex flex-col space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center justify-between p-2 border-b border-amber-900/20">
                        <span className="text-sm text-amber-700">Welcome,</span>
                        <Link to="/dashboard" className="font-medium text-amber-800 hover:text-amber-900">
                          {user.name}
                        </Link>
                        <button 
                          onClick={logout} 
                          className="text-sm text-amber-600 hover:text-red-700 ml-4"
                        >
                          Logout
                        </button>
                      </div>
                      <Link to="/dashboard" className="block p-2 text-center hover:bg-amber-100/50">
                        Dashboard
                      </Link>
                      <Link to="/profile" className="block p-2 text-center hover:bg-amber-100/50">
                        Profile
                      </Link>
                      <Link to="/settings" className="block p-2 text-center hover:bg-amber-100/50">
                        Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block p-2 text-center hover:bg-gray-200/50">
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="block p-2 text-center bg-gradient-to-r from-amber-700 to-orange-800 text-white rounded-lg hover:opacity-90 transition-all duration-300"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-700 to-orange-800 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-amber-700">Welcome,</span>
                      <Link to="/dashboard" className="font-medium text-amber-800 hover:text-amber-900 transition-colors">
                        {user.name}
                      </Link>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to="/settings"
                      className="p-2 rounded-lg glass hover:bg-gray-200/50 text-gray-700 transition-all duration-300"
                      title="Settings"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31.826-2.37-2.37a1.724 1.724 0 002.572-1.065c1.756-.426 1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543.826-3.31 2.37-2.37.1.724 1.724 0 002.572-1.065c1.756-.426 1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543-.826 3.31-2.37-2.37A1.724 1.724 0 0017.826 6.724zM12 16a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                    </Link>
                    <button 
                      onClick={logout} 
                      className="p-2 rounded-lg glass hover:bg-red-500/20 text-red-700 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="p-2 rounded-lg glass hover:bg-gray-200/50 transition-colors">
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="p-2 rounded-lg bg-gradient-to-r from-amber-700 to-orange-800 text-white hover:opacity-90 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}