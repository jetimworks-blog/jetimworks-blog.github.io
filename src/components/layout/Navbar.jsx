import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, Mail, User, LogOut, Settings, History } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = isAuthenticated
    ? [
        { to: '/home', label: 'Home', icon: Mail },
        { to: '/history', label: 'History', icon: History },
        { to: '/settings', label: 'Settings', icon: Settings },
      ]
    : [];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-navy-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center"
            >
              <Mail className="w-6 h-6 text-white" />
            </motion.div>
            <span className="font-serif font-bold text-xl text-navy-800">
              Email Crafter
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive(link.to)
                      ? 'bg-navy-50 text-brand-blue font-medium'
                      : 'text-navy-600 hover:bg-navy-50'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-navy-200">
                <div className="flex items-center gap-2 text-navy-600">
                  <User size={18} />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-navy-600 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="btn-ghost text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-navy-600 hover:bg-navy-50 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-navy-100"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive(link.to)
                      ? 'bg-navy-50 text-brand-blue font-medium'
                      : 'text-navy-600 hover:bg-navy-50'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
