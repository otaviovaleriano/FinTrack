import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { useUser } from "../UserContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = (path) =>
    pathname === path
      ? "text-blue-500 font-semibold border-b-2 border-blue-500"
      : "text-gray-700 hover:text-blue-500";

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <nav
      className="shadow-md px-6 py-0 flex items-center justify-between"
      style={{ backgroundColor: "#F9F8F7" }}
    >
      <img
        src={require("../assets/FinTrack-logo.png")}
        alt="FinTrack Logo"
        className="h-20 w-22"
      />

      <div className="flex-1 flex justify-center space-x-8">
        <Link to="/" className={linkStyle("/")}>
          Dashboard
        </Link>
        <Link to="/expenses" className={linkStyle("/expenses")}>
          Expenses
        </Link>
      </div>

      {user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
              {getInitials(user.name || user.email)}
            </div>
            <span className="text-gray-800 font-medium">
              {user.name || user.email}
            </span>
            <FiChevronDown
              className={`transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10 transform transition-all duration-200 origin-top scale-95 animate-fade-in">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
