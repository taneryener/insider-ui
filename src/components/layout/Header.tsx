// src/components/layout/Header.tsx
import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Insider Test Case</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                S
              </Link>
            </li>
            <li>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
            </li>
            {/* Add more links if needed */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
