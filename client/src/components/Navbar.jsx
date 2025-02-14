import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileAbout, setMobileAbout] = useState(false);
  const [mobileContact, setMobileContact] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 flex-wrap bg-white border-b border-gray-100">
        {/* Logo */}
        <div className="logo flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img src="src/img/connect_logo_black.png" width="80" height="60" alt="Logo" />
            <h1 className="ml-2 text-2xl font-bold text-blue-600 hidden lg:block">
              Alum Connect
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8 flex-1 justify-end">
          <ul className="flex items-center space-x-8">
            <li>
              <Link to="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
            </li>
            {/* About Link with Hover Dropdown */}
            <li className="relative group">
              <span className="text-gray-700 hover:text-gray-900 cursor-pointer">
                About
              </span>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-96 p-6 bg-white border border-gray-100 shadow-md rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                {/* About content */}
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">About DevNexus</h2>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  We are DevNexus, a passionate team of dedicated developers, focused on bridging the gap between alumni and their alma mater.
                </p>
              </div>
            </li>
            {/* Contact Link with Hover Dropdown */}
            <li className="relative group">
              <span className="text-gray-700 hover:text-gray-900 cursor-pointer">
                Contact
              </span>
              <div className="absolute right-1/2 transform translate-x-1/2 top-full mt-2 w-96 p-6 bg-white border border-gray-100 shadow-md rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                {/* Contact content */}
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">Get in Touch</h2>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Contact us at <br />
                  Email: contact@devnexus.com
                </p>
              </div>
            </li>
          </ul>
          {/* Sign Up Button */}
          <div className="button-container ml-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
            >
              Sign Up Now
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <li>
              <Link to="/" className="block text-blue-600 hover:text-blue-800">
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => setMobileAbout(!mobileAbout)}
                className="w-full flex justify-between items-center text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <span>About</span>
                <ChevronDown className={`transition-transform ${mobileAbout ? 'rotate-180' : ''}`} size={20} />
              </button>
              {mobileAbout && (
                <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded">
                  <h2 className="text-xl font-semibold text-gray-800">About DevNexus</h2>
                  <p className="mt-4 text-sm text-gray-600">
                    We are DevNexus, a passionate team of dedicated developers, focused on bridging the gap between alumni and their alma mater.
                  </p>
                </div>
              )}
            </li>
            <li>
              <button
                onClick={() => setMobileContact(!mobileContact)}
                className="w-full flex justify-between items-center text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <span>Contact</span>
                <ChevronDown className={`transition-transform ${mobileContact ? 'rotate-180' : ''}`} size={20} />
              </button>
              {mobileContact && (
                <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded">
                  <h2 className="text-xl font-semibold text-gray-800">Get in Touch</h2>
                  <p className="mt-4 text-sm text-gray-600">
                    Contact us at <br />
                    Email: contact@devnexus.com
                  </p>
                </div>
              )}
            </li>
            <li>
              {/* Sign Up Button */}
              <div className="button-container ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
                >
                  Sign Up Now
                </Link>
              </div>
            </li>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
