import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome, AiOutlineBarChart, AiOutlineGlobal, AiOutlineBell, AiOutlineSetting } from "react-icons/ai";
import logo from "../assets/Pollu-Warner.png"; // Adjust the path to your logo

function Layout({ children }) {
  const location = useLocation(); // Get the current route
  const [dropdownOpen, setDropdownOpen] = useState(false); // Manage dropdown visibility

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-blue-50">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-teal-600 to-green-500 text-white shadow-lg fixed top-0 left-0 z-20">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center shadow-md">
          {/* Logo */}
          <img src={logo} alt="Pollu-Warner Logo" className="h-20" />
          
          {/* Hamburger Button on the right */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-white p-2 rounded-md focus:outline-none"
            >
              <div className="space-y-1">
                <div className="w-6 h-1 bg-white"></div>
                <div className="w-6 h-1 bg-white"></div>
                <div className="w-6 h-1 bg-white"></div>
                <div className="w-6 h-1 bg-white"></div>
              </div>
            </button>
            {dropdownOpen && (
              <div className="absolute top-10 right-0 bg-teal-700 text-white shadow-lg rounded-md mt-2 w-48">
                <Link
                  to="/aqialerts"
                  className="flex items-center px-4 py-2 hover:bg-teal-200"
                >
                  <AiOutlineBell size={20} className="mr-2" />
                  My Alerts
                </Link>
                <Link
                  to="/alerts"
                  className="flex items-center px-4 py-2 hover:bg-teal-200"
                >
                  <AiOutlineGlobal size={20} className="mr-2" />
                  Regions Alerts
                </Link>
                <Link
                  to="/customize"
                  className="flex items-center px-4 py-2 hover:bg-teal-200"
                >
                  <AiOutlineSetting size={20} className="mr-2" />
                  Custom Recommendations
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-6 mt-12 bg-white shadow-md rounded-t-xl pb-20 pt-24 z-10 relative">
        {/* Children are injected here */}
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="w-full bg-teal-700 text-white shadow-md fixed bottom-0 left-0 z-10">
        <div className="flex justify-around items-center py-3">
          <Link
            to="/"
            className={`flex flex-col items-center ${
              location.pathname === "/" ? "text-white font-bold" : "text-teal-200"
            } hover:text-white transition duration-300`}
          >
            <AiOutlineHome size={24} />
            <span className="text-sm mt-1">Home</span>
          </Link>
          <Link
            to="/chart"
            className={`flex flex-col items-center ${
              location.pathname === "/chart" ? "text-white font-bold" : "text-teal-200"
            } hover:text-white transition duration-300`}
          >
            <AiOutlineBarChart size={24} />
            <span className="text-sm mt-1">Chart</span>
          </Link>
          <Link
            to="/map"
            className={`flex flex-col items-center ${
              location.pathname === "/map" ? "text-white font-bold" : "text-teal-200"
            } hover:text-white transition duration-300`}
          >
            <AiOutlineGlobal size={24} />
            <span className="text-sm mt-1">Map</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Layout;