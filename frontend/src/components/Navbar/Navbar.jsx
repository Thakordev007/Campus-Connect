import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'faculty':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CC</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Campus Connect</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {!isAuthenticated ? (
                <>
                  <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </Link>
                  <Link to="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    About
                  </Link>
                  <Link to="/contact" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Contact
                  </Link>
                  <Link to="/login" className="btn-primary">
                    Login
                  </Link>
                  <Link to="/register" className="btn-secondary">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link to="/events" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Events
                  </Link>
                  <Link to="/exams" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Exams
                  </Link>
                  <Link to="/results" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Results
                  </Link>
                  <Link to="/materials" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Materials
                  </Link>
                </>
              )}
            </div>

            {/* User Profile */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <User className="w-5 h-5" />
                    <span>{user?.first_name || user?.username}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600 p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
                {!isAuthenticated ? (
                  <>
                    <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Register</Link>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span className="font-medium">{user?.first_name || user?.username}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                          {user?.role?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    <Link to="/events" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Events</Link>
                    <Link to="/exams" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Exams</Link>
                    <Link to="/results" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Results</Link>
                    <Link to="/materials" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Materials</Link>
                    <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-base font-medium">Logout</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="pt-16"></div>
    </>
  );
};

export default Navbar;
