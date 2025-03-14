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
            <img
              src="assets/connect_logo_black.png"
              width="80"
              height="60"
              alt="Logo"
            />
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
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    About DevNexus
                  </h2>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  We are DevNexus, a passionate team of dedicated developers,
                  focused on bridging the gap between alumni and their alma mater.
                  As a dynamic and innovative startup, we aim to create meaningful
                  connections that will strengthen the bond between alumni, current
                  students, and the institution.
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  Our team brings together diverse skills in web development,
                  machine learning, app development, and design to ensure the platform
                  is robust, scalable, and user-friendly. With a shared vision, we
                  strive to provide a seamless experience for all users.
                </p>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">Mission</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Our mission is to empower alumni to stay connected with their
                  college and juniors, fostering a collaborative network where
                  knowledge, experiences, and opportunities can be shared freely.
                  We believe in building strong relationships that benefit both
                  individuals and the institution.
                </p>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">Vision</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  We envision a thriving alumni network where every alumnus plays a
                  vital role in the growth and development of the college community.
                  By enabling seamless communication and interaction, we aim to create
                  an ecosystem where alumni and students can collaborate to uplift
                  their institution and make it a center of excellence.
                </p>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">Goal</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Our goal is to provide a platform where alumni can actively contribute
                  to their college’s progress. Through mentoring, donations, and
                  networking, alumni can help shape the future of the college, offering
                  invaluable support to students and faculty alike.
                </p>
              </div>
            </li>

            {/* Contact Link with Hover Dropdown */}
            <li className="relative group">
              <span className="text-gray-700 hover:text-gray-900 cursor-pointer">
                Contact
              </span>
              <div className="absolute right-1/2 transform translate-x-1/2 top-full mt-2 w-96 p-6 bg-white border border-gray-100 shadow-md rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Get in Touch with Us
                  </h2>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  At DevNexus, we are committed to creating lasting relationships that
                  connect alumni with their alma mater and current students. Whether
                  you are an alumnus looking to give back or a student seeking guidance,
                  we are here to support you.
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Anuj Singh</strong>
                  <br />
                  <a
                    href="https://www.linkedin.com/in/anujsanjaysingh/"
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn
                  </a>
                  <br />
                  <a
                    href="https://www.instagram.com/glockholm/"
                    className="text-blue-500 hover:underline"
                  >
                    Instagram
                  </a>
                  <br />
                  Contact: +91 998-733-7572
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Nayan Mandal</strong>
                  <br />
                  <a
                    href="https://www.linkedin.com/in/9keystrokes/"
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn
                  </a>
                  <br />
                  <a
                    href="https://www.instagram.com/9keystrokes/"
                    className="text-blue-500 hover:underline"
                  >
                    Instagram
                  </a>
                  <br />
                  Contact: +91 936-966-67968
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Vashu Parashar</strong>
                  <br />
                  <a
                    href="https://www.linkedin.com/in/vasuparashar18/"
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn
                  </a>
                  <br />
                  <a
                    href="https://www.instagram.com/whovasu/"
                    className="text-blue-500 hover:underline"
                  >
                    Instagram
                  </a>
                  <br />
                  Contact: +91 846-893-8745
                </p>
                
                <p className="mt-4 text-sm text-gray-600">
                  For general inquiries, or to learn more about contributing to the alumni
                  community, please contact us at:
                  <br />
                  Email: contact@devnexus.com
                  <br />
                  Phone: +91 -
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  Stay updated with our latest news:
                  <br />
                  <a href="#" className="text-blue-500 hover:underline">
                    LinkedIn (DevNexus)
                  </a>
                  <br />
                  <a href="#" className="text-blue-500 hover:underline">
                    Instagram (DevNexus)
                  </a>
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  At DevNexus, we believe in the power of community and look forward to
                  connecting with you.
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
              Sign In
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
        <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full">
          <div className="px-4 py-4 space-y-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-blue-600 text-lg"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setMobileAbout(!mobileAbout)}
                  className="w-full flex justify-between items-center text-gray-700 hover:text-blue-600 text-lg focus:outline-none"
                >
                  <span>About</span>
                  <ChevronDown
                    className={`transition-transform ${mobileAbout ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </button>
                {mobileAbout && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 text-center">
                      About DevNexus
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      We are DevNexus, a passionate team of dedicated developers, focused
                      on bridging the gap between alumni and their alma mater. As a dynamic
                      and innovative startup, we aim to create meaningful connections that
                      will strengthen the bond between alumni, current students, and the
                      institution.
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Our team brings together diverse skills in web development, machine
                      learning, app development, and design to ensure a robust and user-friendly
                      platform.
                    </p>
                    <div className="mt-2 text-center">
                      <h3 className="text-md font-semibold text-gray-800">Mission</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Our mission is to empower alumni to stay connected with their college and juniors.
                    </p>
                    <div className="mt-2 text-center">
                      <h3 className="text-md font-semibold text-gray-800">Vision</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      We envision a thriving alumni network where every alumnus plays a vital role in the growth and development of the college community.
                    </p>
                    <div className="mt-2 text-center">
                      <h3 className="text-md font-semibold text-gray-800">Goal</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Our goal is to provide a platform where alumni can actively contribute to their college’s progress.
                    </p>
                  </div>
                )}
              </li>
              <li>
                <button
                  onClick={() => setMobileContact(!mobileContact)}
                  className="w-full flex justify-between items-center text-gray-700 hover:text-blue-600 text-lg focus:outline-none"
                >
                  <span>Contact</span>
                  <ChevronDown
                    className={`transition-transform ${mobileContact ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </button>
                {mobileContact && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 text-center">
                      Get in Touch with Us
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      At DevNexus, we are committed to creating lasting relationships that connect alumni with their alma mater and current students.
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      <strong>Anuj Singh</strong>
                      <br />
                      <a
                        href="https://www.linkedin.com/in/anujsanjaysingh/"
                        className="text-blue-500 hover:underline"
                      >
                        LinkedIn
                      </a>
                      <br />
                      <a
                        href="https://www.instagram.com/glockholm/"
                        className="text-blue-500 hover:underline"
                      >
                        Instagram
                      </a>
                      <br />
                      Contact: +91 998-733-7572
                    </p>
                    <p className="mt-4 text-sm text-gray-600">
                      <strong>Nayan Mandal</strong>
                      <br />
                      <a
                        href="https://www.linkedin.com/in/9keystrokes/"
                        className="text-blue-500 hover:underline"
                      >
                        LinkedIn
                      </a>
                      <br />
                      <a
                        href="https://www.instagram.com/9keystrokes/"
                        className="text-blue-500 hover:underline"
                      >
                        Instagram
                      </a>
                      <br />
                      Contact: +91 936-966-67968
                    </p>
                    <p className="mt-4 text-sm text-gray-600">
                      <strong>Vashu Parashar</strong>
                      <br />
                      <a
                        href="https://www.linkedin.com/in/vasuparashar18/"
                        className="text-blue-500 hover:underline"
                      >
                        LinkedIn
                      </a>
                      <br />
                      <a
                        href="https://www.instagram.com/whovasu/"
                        className="text-blue-500 hover:underline"
                      >
                        Instagram
                      </a>
                      <br />
                      Contact: +91 846-893-8745
                    </p>
                
                    <p className="mt-2 text-sm text-gray-600">
                      For general inquiries, or to learn more about contributing to the alumni community, please contact us at:
                      <br />
                      Email: contact@devnexus.com
                      <br />
                      Phone: +91 -
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Stay updated with our latest news:
                      <br />
                      <a href="#" className="text-blue-500 hover:underline">
                        LinkedIn (DevNexus)
                      </a>
                      <br />
                      <a href="#" className="text-blue-500 hover:underline">
                        Instagram (DevNexus)
                      </a>
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      At DevNexus, we believe in the power of community and look forward to connecting with you.
                    </p>
                  </div>
                )}
              </li>
              <li className="pt-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Sign Up Now
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
