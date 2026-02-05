import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../api/client';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.list({ page });
      setStudents(response.data.results || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading students...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Students</h1>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="divide-y">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-gray-600">{student.email}</p>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Age {student.age}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              No students found
            </div>
          )}
        </div>
      </div>

      {/* Basic Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 font-medium">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
