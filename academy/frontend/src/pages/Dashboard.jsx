import React, { useState, useEffect } from "react";
import { studentsAPI } from "../api/client";

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, recent: [] });
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await studentsAPI.list();
      const studentsList = res.data.results || res.data || [];
      
      // SORT BY CREATED_AT DESCENDING (most recent first)
      const sortedStudents = studentsList.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      
      setStats({
        students: res.data.count || studentsList.length || 0,
        recent: sortedStudents.slice(0, 5),
      });
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchStats();
}, []);


  if (loading) return <div className="text-center py-12">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Dashboard</h1>
      
      {/* Stats Cards */}
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

      {/* Recent Students */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">Recent Students</h3>
        </div>
        <div className="divide-y">
          {stats.recent.map((student) => (
            <div key={student.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{student.name}</h4>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <span className="text-sm text-gray-500">Age {student.age}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
