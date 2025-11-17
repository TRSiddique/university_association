import { Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/members", label: "Members" },
    { path: "/news", label: "News" },
    { path: "/committee", label: "Committee" },
    { path: "/gallery", label: "Gallery" },
    { path: "/resources", label: "Resources" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && event.target.closest('button')?.ariaLabel !== 'Toggle menu') {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  // Helper function to check if a path is active
  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl sticky top-0 z-50 border-b border-blue-600/30">
      <div className="w-[95%] lg:w-[90%] mx-auto flex justify-between items-center py-3">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 group"
        >
          <div className="relative">
            <img 
              src={logo} 
              alt="CUSAP Logo" 
              className="w-12 h-12 drop-shadow-lg group-hover:rotate-3 transition-transform duration-300" 
            />
            <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-white drop-shadow-md tracking-tight">
              CUSAP
            </p>
            <p className="text-xs text-blue-200 drop-shadow-md max-w-[180px] leading-tight">
              Chittagong University Students Association of Pekua
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-medium rounded-lg mx-1 transition-all duration-300 group ${
                  isActive
                    ? "text-white bg-blue-600/30 shadow-lg"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {link.label}
              <span 
                className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 group-hover:w-full ${
                  isActivePath(link.path) ? "w-full" : ""
                }`}
              ></span>
            </NavLink>
          ))}
          
          {/* Forms Link */}
          <NavLink
            to={isAdmin() ? "/admin/forms" : "/forms"}
            className={({ isActive }) =>
              `relative px-4 py-2 text-sm font-medium rounded-lg mx-1 transition-all duration-300 group ${
                isActive
                  ? "text-white bg-amber-600/30 shadow-lg"
                  : "text-amber-100 hover:text-white hover:bg-white/10"
              }`
            }
          >
            {isAdmin() ? "📊 Forms Dashboard" : " Forms"}
            <span 
              className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300 group-hover:w-full ${
                isActivePath("/forms") ? "w-full" : ""
              }`}
            ></span>
          </NavLink>
        </div>

        {/* Desktop Admin/Auth Section */}
        <div className="hidden lg:flex items-center gap-4">
          {isAdmin() ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-4 py-2 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span>Admin</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 py-2 animate-in fade-in-0 zoom-in-95">
                  <div className="px-4 py-3 border-b border-gray-200/50">
                    <p className="text-sm font-semibold text-gray-900">Admin Panel</p>
                    <p className="text-xs text-gray-600">Full access granted</p>
                  </div>
                  
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200/50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/admin-login"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-6 py-2.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Admin Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="lg:hidden relative w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group"
        >
          <div className="relative w-6 h-6">
            <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isOpen ? "rotate-45" : "-translate-y-2"
            }`}></span>
            <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}></span>
            <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isOpen ? "-rotate-45" : "translate-y-2"
            }`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Slide-out Menu */}
        <div 
          ref={mobileMenuRef}
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-slate-900 to-blue-900 shadow-2xl transform transition-transform duration-300 overflow-y-auto ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          
          {/* Header - Sticky */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-blue-900 z-10 flex items-center justify-between p-6 border-b border-blue-700/50">
            <div className="flex items-center gap-3">
              <img src={logo} alt="CUSAP Logo" className="w-10 h-10" />
              <div>
                <p className="text-lg font-bold text-white">CUSAP</p>
                <p className="text-xs text-blue-200">Students Association</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Navigation Links - Scrollable */}
          <div className="p-4 space-y-2 flex-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-white font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-600/50 shadow-lg border-l-4 border-cyan-400"
                      : "hover:bg-white/10 hover:border-l-4 hover:border-white/30"
                  }`
                }
              >
                <div className={`w-2 h-2 rounded-full ${
                  isActivePath(link.path) ? "bg-cyan-400" : "bg-white/30 group-hover:bg-white"
                }`}></div>
                {link.label}
              </NavLink>
            ))}

            {/* Forms Link */}
            <NavLink
              to={isAdmin() ? "/admin/forms" : "/forms"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-amber-600/30 shadow-lg border-l-4 border-amber-400 text-white"
                    : "text-amber-100 hover:bg-white/10 hover:border-l-4 hover:border-amber-300/50"
                }`
              }
            >
              <div className={`w-2 h-2 rounded-full ${
                isActivePath("/forms") ? "bg-amber-400" : "bg-amber-300/50 group-hover:bg-amber-300"
              }`}></div>
              {isAdmin() ? "📊 Forms Dashboard" : " Forms"}
            </NavLink>
          </div>

          {/* Admin Section - Sticky Bottom */}
          <div className=" bottom-0 left-0 right-0 p-4 border-t border-blue-700/50">
            {isAdmin() ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-600/20 rounded-xl border border-emerald-500/30">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Admin Mode</p>
                    <p className="text-xs text-emerald-200">Full access</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    <Settings size={14} />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <NavLink
                to="/admin-login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-1 text-xs py-3 border border-red-600 w-34 rounded-xl text-white font-semibold shadow-lg transition-all duration-300"
              >
                <User size={14} />
                Admin Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;