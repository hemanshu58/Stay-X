import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGlobe, FaYoutube, FaBehance } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        
        {/* About Us Section */}
        <div className="md:col-span-1 lg:col-span-1">
          <div className="flex items-center space-x-3 mb-6">
            <img src="/images/logo.png" alt="StayX Logo" className="w-14 h-14" />
            <h2 className="text-3xl font-bold">StayX</h2>
          </div>
          <p className="text-gray-400 text-sm">
            StayX is the easiest platform to find verified rental properties. We offer high-quality listings with 
            accurate details to ensure a smooth rental experience in your city.
          </p>
        </div>

        {/* Navigation Links Section */}
        <div className="md:col-span-1 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
            <li><a href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</a></li>
            <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="md:col-span-2 lg:col-span-1 text-center lg:text-left">
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex justify-center lg:justify-start space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 transition">
              <FaFacebookF className="text-2xl" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition">
              <FaTwitter className="text-2xl" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500 transition">
              <FaInstagram className="text-2xl" />
            </a>
            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition">
              <FaBehance className="text-2xl" />
            </a>
            <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-500 transition">
              <FaGlobe className="text-2xl" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500 transition">
              <FaYoutube className="text-2xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        <p>&copy; 2024 StayX. All rights reserved.</p>
        <p className="mt-2">
          Designed with ❤️ by StayX Team 
        </p>
      </div>
    </footer>
  );
};

export default Footer;
