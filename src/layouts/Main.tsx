import React from 'react';
import { Outlet } from 'react-router-dom';

const Main: React.FC = () => {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4">Insider Test Case</header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Main;
