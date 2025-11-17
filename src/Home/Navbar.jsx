import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/members", label: "Members" },
    { path: "/news", label: "News" },
    { path: "/committee", label: "Committee" },
    { path: "/gallery", label: "Gallery" },
    { path: "/Resources", label: "Resources" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-blue-600 to-sky-500 shadow-lg sticky top-0 z-50">
      <div className="w-[90%] mx-auto flex justify-between items-center py-4">
        <Link
          to="/"
          className="flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <img src={logo} alt="CUSAP Logo" className="w-10 h-10" />
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-white drop-shadow-md">CUSAP</p>
            <p className="text-xs text-white drop-shadow-md">
              Chittagong University Students Association of Pekua
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-white font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `hover:text-green-900 transition-colors ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          
          {/* ========== UPDATED: Conditional Forms Link ========== */}
          {isAdmin() ? (
            <NavLink
              to="/admin/forms"
              className={({ isActive }) =>
                `hover:text-green-900 transition-colors ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              Forms Dashboard
            </NavLink>
          ) : (
            <NavLink
              to="/forms"
              className={({ isActive }) =>
                `hover:text-green-900 transition-colors ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              Forms
            </NavLink>
          )}
          
          {/* Admin Section */}
          {isAdmin() ? (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/30">
              <span className="text-sm bg-green-600 px-2 py-1 rounded-md font-semibold">
                👋 Admin
              </span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/admin-login"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              Admin Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-lime-200 shadow-inner transition-all">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-3 text-gray-800 hover:bg-lime-300 hover:text-green-800 ${
                  isActive ? "bg-lime-300 font-semibold" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          
          {/* ========== UPDATED: Conditional Forms Link for Mobile ========== */}
          {isAdmin() ? (
            <NavLink
              to="/admin/forms"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-3 text-gray-800 hover:bg-lime-300 hover:text-green-800 ${
                  isActive ? "bg-lime-300 font-semibold" : ""
                }`
              }
            >
              📋 Forms Dashboard
            </NavLink>
          ) : (
            <NavLink
              to="/forms"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-3 text-gray-800 hover:bg-lime-300 hover:text-green-800 ${
                  isActive ? "bg-lime-300 font-semibold" : ""
                }`
              }
            >
              📝 Forms
            </NavLink>
          )}
          
          {/* Admin Section for Mobile */}
          <div className="border-t border-gray-300 mt-2 pt-2">
            {isAdmin() ? (
              <div className="px-6 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-800 font-semibold">👋 Admin Mode</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
                <p className="text-xs text-gray-600">You can manage forms and members</p>
              </div>
            ) : (
              <NavLink
                to="/admin-login"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-3 bg-green-600 text-white hover:bg-green-700 font-semibold"
              >
                Admin Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;