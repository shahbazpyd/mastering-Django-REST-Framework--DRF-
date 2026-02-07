import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { studentsAPI, coursesAPI } from '../api/client';

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
    fetchCourses();
  }, []);

  const fetchStudent = async () => {
    const response = await studentsAPI.retrieve(id);
    setStudent(response.data);
  };

  const fetchCourses = async () => {
    const response = await coursesAPI.list();
    setAvailableCourses(response.data);
    setLoading(false);
  };

  const handleEnroll = async (courseId) => {
    await apiClient.post('/api/enrollments/', {
      student: id,
      course: courseId
    });
    alert('Enrolled successfully!');
    fetchStudent();  // Refresh
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{student?.name}'s Profile</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Student Info */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Student Details</h2>
          <p><strong>Email:</strong> {student?.email}</p>
          <p><strong>Age:</strong> {student?.age}</p>
          <p><strong>Total Enrollments:</strong> {student?.enrollments?.length || 0}</p>
        </div>

        {/* Enroll in Course */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Enroll in Course</h2>
          <select className="w-full p-3 border border-gray-300 rounded-xl mb-4">
            {availableCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title} - ${course.price}
              </option>
            ))}
          </select>
          <button className="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-bold hover:bg-green-600">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}
