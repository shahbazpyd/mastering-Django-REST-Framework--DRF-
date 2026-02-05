import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, token, logout }) {
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Academy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/students" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md font-medium">
                Students
              </a>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-4">{children}</main>
    </div>
  );
}
