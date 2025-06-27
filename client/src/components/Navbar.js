import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { useUser } from "../UserContext";
import i18n from "i18next";
import usFlag from "../assets/flags/us.png";
import esFlag from "../assets/flags/es.png";
import ptFlag from "../assets/flags/pt.png";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const menuRef = useRef(null);
  const langRef = useRef(null);
  const { t } = useTranslation();

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      langRef.current &&
      !langRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
      setLangDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("filterStartDate");
    localStorage.removeItem("filterEndDate");
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

  const flags = {
    en: usFlag,
    es: esFlag,
    pt: ptFlag,
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdown(false);
  };

  return (
    <nav
      className="shadow-md px-6 py-0 flex items-center justify-between"
      style={{ backgroundColor: "#F9F8F7" }}
    >
      <img
        src={require("../assets/FinTrack-logo.png")}
        alt="FinTrack Logo"
        className="h-16 sm:h-20"
      />

      <div className="flex-1 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
        <Link to="/" className={linkStyle("/")}>
          {t("navbar.dashboard")}
        </Link>
        <Link to="/expenses" className={linkStyle("/expenses")}>
          {t("navbar.expenses")}
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
        {/* Language Switcher */}
        <div className="relative" ref={langRef}>
          <div
            className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 overflow-hidden cursor-pointer"
            onClick={() => setLangDropdown((prev) => !prev)}
            title="Change language"
          >
            <img
              src={flags[i18n.language] || usFlag}
              alt="Lang"
              className="w-6 h-6 object-cover"
            />
          </div>

          {langDropdown && (
            <div className="absolute right-0 mt-15 w-40 bg-white border rounded-md shadow z-50">
              <button
                onClick={() => changeLanguage("en")}
                className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <img src={usFlag} alt="EN" className="w-5 h-5" />
                English
              </button>
              <button
                onClick={() => changeLanguage("es")}
                className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <img src={esFlag} alt="ES" className="w-5 h-5" />
                Español
              </button>
              <button
                onClick={() => changeLanguage("pt")}
                className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <img src={ptFlag} alt="PT" className="w-5 h-5" />
                Português
              </button>
            </div>
          )}
        </div>

        {/* User Menu */}
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
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  {t("navbar.logout")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
