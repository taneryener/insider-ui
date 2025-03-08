// src/components/layout/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200">
      <div className="p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/profile" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">
              Profile
            </Link>
          </li>
          {/* Additional shared links go here */}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
