import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Users, Home } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">Academy</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-lg ${location.pathname === '/' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                <Home size={20} /> Dashboard
              </Link>
              <Link to="/students" className={`flex items-center gap-2 px-3 py-2 rounded-lg ${location.pathname === '/students' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                <Users size={20} /> Students
              </Link>
              <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                <LogOut size={20} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
