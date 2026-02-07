import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";  // ← ADD THIS IMPORT
import { studentsAPI } from "../api/client";

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await studentsAPI.list();
        const studentsList = Array.isArray(res.data?.results)
          ? res.data.results
          : [];

        setStats({
          students: res.data?.count || studentsList.length || 0,
          recent: studentsList.slice(0, 5),
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        Dashboard
      </h1>
      
      {/* Courses Link */}
      <Link
        to="/courses"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all mb-8"
      >
        Browse Courses →
      </Link>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Students
          </h3>
          <div className="text-4xl font-bold text-blue-600">
            {stats.students}
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Recent Enrollments
          </h3>
          <div className="text-4xl font-bold text-green-600">
            {stats.recent.length}
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Active Courses
          </h3>
          <div className="text-4xl font-bold text-purple-600">
            2
          </div>
        </div>
      </div>

      {/* Recent Students */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h3 className="text-xl font-bold">Recent Students</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recent.map((student) => (
            <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-900">{student.name}</h4>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Age {student.age}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
