import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHome,
  FaHeart,
  FaFileAlt,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";
import config from "../configs/config";
import { getCookie } from "../utils/getCookie";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuIconRef = useRef(null);
  const navigate = useNavigate();

  const isLogged = getCookie("isLogged");
  const isAuthenticated = isLogged === "true";

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuIconRef.current &&
        !menuIconRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleFavouritesClick = () => {
    navigate("/favourites");
  };

  const handleMyPropertiesClick = () => {
    navigate("/myproperties");
  };

  const handlePrivacyPolicyClick = () => {
    navigate("/privacy-policy");
  };

  const handleTermsAndConditionsClick = () => {
    navigate("/terms-and-conditions");
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/auth/signout`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        document.cookie = "isLogged=; path=/; max-age=0; SameSite=Strict";
        navigate("/");
        window.location.reload();
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center py-2 px-4 shadow-md text-white" style={{ backgroundColor: '#008080' }}>
      <div
        className="flex items-center cursor-pointer"
        onClick={handleLogoClick}
      >
        <img
          src="/images/logo.png"
          alt="StayX Logo"
          className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
        />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-semibold">FlateMate</h1>
      </div>
      <div className="flex items-center">
        {isAuthenticated ? (
          <Link
            to="/upload-property"
            className="flex items-center bg-white text-black px-2 py-1 rounded mr-2 hover:bg-gray-200"
          >
            <span className="text-lg mr-1">➕</span>
            <span className="text-base">Upload Property</span>
          </Link>
        ) : (
          <div
            className="flex items-center bg-white text-black px-2 py-1 rounded mr-2 cursor-pointer hover:bg-gray-200"
            onClick={handleLoginClick}
          >
            <span className="text-lg mr-1">🔑</span>
            <span className="text-base">Login/Register</span>
          </div>
        )}

        <div
          className="flex justify-center items-center w-10 h-10 border border-white rounded-full cursor-pointer"
          onClick={toggleMenu}
          ref={menuIconRef}
        >
          <i className="text-2xl not-italic">{menuOpen ? "✖" : "☰"}</i>
        </div>

        {/* Dropdown menu */}
        <div
          className={`absolute right-2 top-14 p-3 border border-gray-300 rounded-md bg-white shadow-md 
          transition-opacity transform ${
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          } z-50`}
          ref={menuRef}
        >
          <ul className="list-none m-0 p-0">
            {isAuthenticated ? (
              <>
                <li
                  className="flex items-center p-2 cursor-pointer text-black hover:bg-gray-100"
                  onClick={handleProfileClick}
                >
                  <FaUser className="mr-2" /> Profile
                </li>
                <li
                  className="flex items-center p-2 cursor-pointer text-black hover:bg-gray-100"
                  onClick={handleMyPropertiesClick}
                >
                  <FaHome className="mr-2" /> My Properties
                </li>
                <li
                  className="flex items-center p-2 cursor-pointer text-black hover:bg-gray-100"
                  onClick={handleFavouritesClick}
                >
                  <FaHeart className="mr-2" /> Favorites
                </li>
                <li
                  className="flex items-center p-2 cursor-pointer text-black hover:bg-gray-100"
                  onClick={handleTermsAndConditionsClick}
                >
                  <FaFileAlt className="mr-2" /> Terms and Conditions
                </li>
                <li
                  className="flex items-center p-2 cursor-pointer text-black hover:bg-gray-100"
                  onClick={handlePrivacyPolicyClick}
                >
                  <FaLock className="mr-2" /> Privacy Policy
                </li>
                <li
                  className="flex items-center p-2 cursor-pointer text-black hover:bg-gray-100"
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </li>
              </>
            ) : (
              <>
                <li
                  className="flex items-center p-2 cursor-pointer text-black hover:bg-gray-100"
                  onClick={handleTermsAndConditionsClick}
                >
                  <FaFileAlt className="mr-2" /> Terms and Conditions
                </li>
                <li
                  className="flex items-center p-2 cursor-pointer text-black hover:bg-gray-100"
                  onClick={handlePrivacyPolicyClick}
                >
                  <FaLock className="mr-2" /> Privacy Policy
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
