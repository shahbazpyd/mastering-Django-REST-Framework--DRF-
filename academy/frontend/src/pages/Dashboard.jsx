import React, { useState, useEffect } from "react";
import { studentsAPI } from "../api/client";

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(""); // 🔍 NEW: Debug display

  useEffect(() => {
// Inside fetchStats in Dashboard.jsx
const fetchStats = async () => {
  try {
    const res = await studentsAPI.list();
    let studentsList = [];

    // 1. Extract the array correctly
    if (res.data?.results && Array.isArray(res.data.results)) {
      studentsList = res.data.results;
    } else if (Array.isArray(res.data)) {
      studentsList = res.data;
    }

    // 2. SAFE SORTING (The Fix)
    // Check if it's actually an array and has elements before sorting
    const sortedStudents = Array.isArray(studentsList) 
      ? [...studentsList].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      : [];

    setStats({
      students: sortedStudents.length,
      recent: sortedStudents.slice(0, 5) // Get top 5 recent
    });

  } catch (err) {
    console.error("Dashboard fetch failed:", err);
  }
};

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-12">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Dashboard</h1>
      
      {/* 🔍 DEBUG INFO - REMOVE IN PRODUCTION */}
      <details className="mb-6 p-4 bg-gray-100 rounded-lg">
        <summary className="cursor-pointer font-medium">Debug API Response</summary>
        <pre className="text-xs overflow-auto mt-2">{debugInfo}</pre>
      </details>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
          <div className="text-4xl font-bold text-blue-600">{stats.students}</div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Courses</h3>
          <div className="text-4xl font-bold text-green-600">12</div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Reports Generated</h3>
          <div className="text-4xl font-bold text-purple-600">45</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">Recent Students</h3>
        </div>
        <div className="divide-y">
          {stats.recent.length > 0 ? (
            stats.recent.map((student) => (
              <div key={student.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{student.name || 'N/A'}</h4>
                    <p className="text-sm text-gray-500">{student.email || 'No email'}</p>
                  </div>
                  <span className="text-sm text-gray-500">Age {student.age || 'N/A'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">No recent students</div>
          )}
        </div>
      </div>
    </div>
  );
}
