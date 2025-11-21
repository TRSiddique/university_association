import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaYoutube, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">CUSAP</h3>
          <p className="text-gray-400">
            CUSAP is a platform for members to connect, share, and grow together. Join us and stay updated with the latest news and events.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-green-400 transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/members" className="hover:text-green-400 transition-colors">Members</Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-green-400 transition-colors">News</Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-green-400 transition-colors">Gallery</Link>
            </li>
            <li>
              <Link to="/forms" className="hover:text-green-400 transition-colors">Forms </Link>
            </li>
            <li>
              <Link to="/resources" className="hover:text-green-400 transition-colors">Resources </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Contact Us</h3>
          <p className="text-gray-400 mb-2">Email: cusap2023@gmail.com</p>
          <p className="text-gray-400 mb-4">Phone: +88 01601 450821</p>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/profile.php?id=61551649208728" className="hover:text-blue-500 transition-colors">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <FaYoutube size={20} />
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-blue-700 transition-colors">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-800 pt-4 text-center">
        <div className="text-white text-x bg-blue-950 mx-auto px-4 py-1">
          Website gifted to CUSAP members by {' '}
          <a 
            href="https://tasfique.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-green-400 hover:text-yellow-400 transition-colors font-bold"
          >
            Tasfiqur Rahman Siddique
          </a>
          {' '}from{' '}
          <a 
            href="https://websheba.net" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-green-400 hover:text-yellow-400 transition-colors font-bold"
          >
            WebSheba
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;