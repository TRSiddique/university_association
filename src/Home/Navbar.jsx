import { Menu, X } from "lucide-react"; // modern icons
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/members", label: "Members" },
    { path: "/news", label: "News" },
    { path: "/committee", label: "Committee" },
    { path: "/about", label: "About Us" },
  ];

  return (
  <nav className="bg-gradient-to-r from-indigo-500 via-blue-600 to-sky-500 shadow-lg sticky top-0 z-50">




      <div className="w-[90%] mx-auto flex justify-between items-center py-4">
      <Link
  to="/"
  className="flex items-center gap-2 text-2xl font-bold text-white drop-shadow-md hover:scale-105 transition-transform"
>
  <img src={logo} alt="CUSAP Logo" className="w-10 h-10" />
  <p>CUSAP</p>
</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-white font-medium">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
