import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Zero Waste Marketplace</h3>
            <p className="text-sm mb-4">
              Reducing waste, one product at a time. Join us in making the world more sustainable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="hover:text-primary-400 transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">For Sellers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="hover:text-primary-400 transition">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="hover:text-primary-400 transition">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition">
                  Seller Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMail className="w-5 h-5 mt-1" />
                <span className="text-sm">support@zerowaste.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiPhone className="w-5 h-5 mt-1" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 mt-1" />
                <span className="text-sm">123 Green Street, Eco City, EC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Zero Waste Marketplace. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-primary-400 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-400 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary-400 transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
