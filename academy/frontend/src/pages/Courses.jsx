import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishedOnly, setPublishedOnly] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [publishedOnly]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = publishedOnly ? { is_published: true } : {};
      const response = await coursesAPI.list(params);
      setCourses(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Courses ({courses.length})
        </h1>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={publishedOnly}
            onChange={(e) => setPublishedOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Published Only</span>
        </label>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  course.is_published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ${course.price}
                </span>
                <div className="flex space-x-2">
                  <Link
                    to={`/courses/${course.id}`}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                  >
                    View Details
                  </Link>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No courses available</h3>
          <p className="text-gray-500 mb-8">Check back later for new courses!</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
