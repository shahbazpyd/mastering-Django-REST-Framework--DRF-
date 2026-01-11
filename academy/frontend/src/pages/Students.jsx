import React, { useState, useEffect, useMemo, useCallback } from "react";
import { studentsAPI } from "../api/client";
import { Plus, Edit, Trash2, FileText, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", age: "", email: "", course: "" });
  const [search, setSearch] = useState("");
  const [reportLoading, setReportLoading] = useState({});
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentsAPI.list();
      let studentsList = res.data.results || res.data || [];
      console.log("Fetched:", studentsList);
      setStudents(studentsList);
      setCurrentPage(1); // Reset to page 1 on refresh
    } catch (error) {
      console.error("Fetch failed:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Pagination logic INSIDE useMemo (reactive)
  const pagination = useMemo(() => {
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    
    const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
    );
    
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
    
    console.log("DEBUG - Students:", students.length, "Filtered:", filteredStudents.length, "Pages:", totalPages, "CurrentPage:", currentPage);
    
    return { filteredStudents, currentStudents, totalPages, indexOfFirstStudent, indexOfLastStudent };
  }, [students, search, currentPage, studentsPerPage]);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const saveStudent = async (e) => {
    e.preventDefault();
    const dataToSend = {
      name: formData.name.trim(),
      age: parseInt(formData.age) || 0,
      email: formData.email.trim(),
      course: formData.course.trim() || null,
    };
    
    try {
      if (editingId) {
        await studentsAPI.update(editingId, dataToSend);
      } else {
        await studentsAPI.create(dataToSend);
      }
      fetchStudents();
      setFormData({ name: "", age: "", email: "", course: "" });
      setEditingId(null);
      setShowForm(false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Save failed:", error.response?.data);
    }
  };

  const deleteStudent = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Delete this student?")) {
      try {
        await studentsAPI.delete(id);
        fetchStudents();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const generateReport = async (id) => {
    try {
      setReportLoading(prev => ({ ...prev, [id]: true }));
      await studentsAPI.report(id);
      alert("Report generating... check Flower dashboard!");
    } catch (error) {
      console.error("Report failed:", error);
    } finally {
      setReportLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const editStudent = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      age: student.age,
      email: student.email,
      course: student.course || "",
    });
    setShowForm(true);
  };

  const { filteredStudents, currentStudents, totalPages, indexOfFirstStudent, indexOfLastStudent } = pagination;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Students</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> New Student
        </button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={saveStudent} className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Student" : "Add New Student"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g. Python Bootcamp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 shadow-lg font-medium transition-all"
            >
              {editingId ? "Update Student" : "Create Student"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: "", age: "", email: "", course: "" });
              }}
              className="bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table + Pagination */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <RefreshCw
                onClick={fetchStudents}
                className={`w-5 h-5 cursor-pointer ${loading ? 'animate-spin text-white' : 'text-blue-100 hover:text-white'}`}
              />
              <h3 className="text-xl font-bold text-white">
                Showing {currentStudents.length} of {filteredStudents.length} students
              </h3>
            </div>
            <span className="text-blue-100 text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No students found. <button onClick={() => setShowForm(true)} className="text-blue-600 hover:underline font-medium">Create one!</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Age</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.age}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {student.course || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => editStudent(student)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-all"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => generateReport(student.id)}
                          disabled={reportLoading[student.id]}
                          className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title="Generate Report"
                        >
                          {reportLoading[student.id] ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <FileText size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ FIXED: Pagination - Only show when needed */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstStudent + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastStudent, filteredStudents.length)}</span> of{' '}
                    <span className="font-medium">{filteredStudents.length}</span> results
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-sm ${
                            currentPage === number
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md hover:border-gray-400'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
