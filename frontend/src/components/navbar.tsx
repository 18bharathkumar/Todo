import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import axios from 'axios';
import { user} from '../store/atoms';
import { useSetAtom, useAtomValue } from 'jotai';
import { url } from '../url/url';



const Navbar: React.FC = () => {

  
  
  const setUser = useSetAtom(user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const currentUser = useAtomValue<any>(user); // Get the current user state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/getUserName`, {
          withCredentials: true, // Include cookies for authentication
        });

        console.log(res.data);
        navigate("/");
        setUser(res.data.name);
      } catch (err) {
       navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    
  }, []); 

  const handleLogout = async () => {
    try {
        await axios.post(`${url}/user/logout`, {}, {
            withCredentials: true
        });
        console.log("Logged out successfully");
        setUser(null);
       
       navigate('/login');
    } catch (error) {
        console.error("Error logging out:", error);
    }
};


  const navItems = [
    { label: 'Todos', to: '/' },
    { label: 'Create-todo', to: '/create-todo' }
  ];

  const getNavLinkClass = ({ isActive, isMobile = false }: { isActive: boolean; isMobile?: boolean }) => {
    const base = isMobile 
      ? 'block px-3 py-2 rounded-md text-base font-medium' 
      : 'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200';
    
    return isActive 
      ? `${base} text-indigo-600 bg-gray-100`
      : `${base} text-gray-600 hover:bg-gray-100 hover:text-gray-900`;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0" onClick={closeMenu}>
              <span className="text-2xl font-bold text-gray-800">Todo Application</span>
            </Link>
          </div>

          {/* Desktop Navigation and Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Desktop Nav Items */}
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => getNavLinkClass({ isActive })}
              >
                {item.label}
              </NavLink>
            ))}

            {/* Conditional rendering based on user authentication */}
            {loading ? (
              <div className="px-4 py-2 text-sm font-medium text-gray-600">Loading...</div>
            ) : currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-800">{currentUser}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Sign In
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Mobile Nav Items */}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className={({ isActive }) => getNavLinkClass({ isActive, isMobile: true })}
            >
              {item.label}
            </NavLink>
          ))}

          {/* Conditional rendering for mobile auth buttons */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="space-y-2 px-2">
              {loading ? (
                <div className="text-center text-sm text-gray-600">Loading...</div>
              ) : currentUser ? (
                <>
                  <div className="text-center text-sm font-medium text-gray-800">{currentUser}</div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={closeMenu}
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;