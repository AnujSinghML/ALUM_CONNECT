// src/components/Navbar.jsx
import React from 'react';
import { Bell, Users, MessageCircle, Search, Gift, ArrowUpRight } from 'lucide-react';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
    <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
      {/* Logo */}
      <div className="logo flex items-center">
        <a href="index.html" className="flex items-center">
          {/* Consider importing the logo for Vite compatibility */}
          <img src="src/img/white_logo-Photoroom.jpg" width="80" height="60" alt="Logo" />
          <h1 className="ml-2 text-2xl font-bold text-gray-800">Alum Connect</h1>
        </a>
      </div>
      {/* Navigation Links and Button */}
      <div className="nav-right flex items-center space-x-8">
        <ul className="flex items-center space-x-8">
          <li>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
          </li>
          {/* About Link with Hover Dropdown */}
          <li className="relative">
            <a href="#about" className="text-gray-700 hover:text-gray-900 inline-block group">
              About
              <div className="hover-box absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-96 p-6 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">About DevNexus</h2>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  We are DevNexus, a passionate team of dedicated developers,
                  focused on bridging the gap between alumni and their alma mater.
                  As a dynamic and innovative startup, we aim to create meaningful
                  connections that strengthen the bond between alumni, current
                  students, and the institution.
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  Our team brings together diverse skills in web development,
                  machine learning, app development, and design to ensure the
                  platform is robust, scalable, and user-friendly. With a shared
                  vision, we strive to provide a seamless experience for all users.
                </p>
                <div className="mt-4">
                  <h3 className="text-center text-sm font-semibold text-gray-800">Mission</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Our mission is to empower alumni to stay connected with their college and juniors, fostering a collaborative network where knowledge, experiences, and opportunities can be shared freely.
                  </p>
                  <h3 className="mt-4 text-center text-sm font-semibold text-gray-800">Vision</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    We envision a thriving alumni network where every alumnus plays a vital role in the growth and development of the college community.
                  </p>
                  <h3 className="mt-4 text-center text-sm font-semibold text-gray-800">Goal</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Our goal is to provide a platform where alumni can actively contribute to their college’s progress.
                  </p>
                </div>
              </div>
            </a>
          </li>
          {/* Contact Link with Hover Dropdown */}
          <li className="relative">
            <a href="#contact" className="text-gray-700 hover:text-gray-900 inline-block group">
              Contact
              <div className="hover-box absolute right-1/2 transform translate-x-1/2 top-full mt-2 w-96 p-6 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">Get in Touch with Us</h2>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  At DevNexus, we are committed to creating lasting relationships
                  that connect alumni with their alma mater and current students.
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  Anuj Singh
                  <br />
                  <a href="https://www.linkedin.com/in/anujsanjaysingh/" className="text-blue-600 hover:underline">LinkedIn</a>
                  <br />
                  <a href="https://www.instagram.com/glockholm/" className="text-pink-600 hover:underline">Instagram</a>
                  <br />
                  Contact: +91 9987337572
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  For general inquiries, or to learn more about contributing to the alumni community, please contact us at:
                  <br />
                  Email: contact@devnexus.com
                  <br />
                  Phone: +91 -
                  <br />
                  Stay updated with our latest news:
                  <br />
                  <a href="#" className="text-blue-600 hover:underline">LinkedIn (DevNexus)</a>
                  <br />
                  <a href="#" className="text-pink-600 hover:underline">Instagram (DevNexus)</a>
                </p>
                <p className="mt-4 text-sm text-gray-600 text-center">
                  At DevNexus, we believe in the power of community and look forward to connecting with you.
                </p>
              </div>
            </a>
          </li>
        </ul>
        {/* Sign Up Button */}
        <div className="button-container">
          <a
            href="login.html"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
          >
            Sign Up Now
          </a>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
