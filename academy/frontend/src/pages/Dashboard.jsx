import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await studentsAPI.list();
        const studentsList = Array.isArray(res.data?.results) ? res.data.results : [];
        
        setStats({
          students: res.data?.count || studentsList.length || 0,
          recent: studentsList.slice(0, 5),
        });
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
          <div className="text-4xl font-bold text-blue-600">{stats.students}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-xl font-bold">Recent Students</h3>
        </div>
        <div className="divide-y">
          {stats.recent.map((student) => (
            <div key={student.id} className="p-6">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">{student.name}</h4>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <span>Age {student.age}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
