import { Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-navy-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-navy-700" />
              </div>
              <span className="font-serif font-bold text-xl">
                Email Crafter
              </span>
            </div>
            <p className="text-navy-200 text-sm max-w-md">
              Craft beautiful, professional emails with the power of AI. 
              Whether you need a quick YOLO send or meticulous attention to detail, 
              we've got you covered.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-navy-200">
              <li>
                <Link to="/home" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">
                  History
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-navy-200">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-navy-300">
            © {new Date().getFullYear()} Email Crafter. All rights reserved.
          </p>
          <p className="text-sm text-navy-300 flex items-center gap-1">
            Made with <Heart size={14} className="text-red-400" /> for email lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
