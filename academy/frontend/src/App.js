// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // API base URL
  const API_BASE = "http://localhost:8000/api";

  // Set auth header
  axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";

  useEffect(() => {
    if (token) {
      fetchStudents();
    }
  }, [token]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/viewset-students/`);
      // Handle DRF pagination
      const studentsList = res.data.results || res.data || [];
      setStudents(Array.isArray(studentsList) ? studentsList : []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudents([]);
    }
  };
  
  const login = async () => {
    try {
      const res = await axios.post(`${API_BASE}/token/`, {
        username: "admin",
        password: "admin123",  // your superuser
      });
      const accessToken = res.data.access;
      localStorage.setItem("token", accessToken);
      setToken(accessToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const createStudent = async () => {
    try {
      const res = await axios.post(`${API_BASE}/viewset-students/`, {
        name: "New Student",
        age: 25,
        email: `student${Date.now()}@example.com`,
      });
      fetchStudents();  // refresh list
    } catch (error) {
      console.error("Create failed:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Academy Dashboard</h1>
      
      {!token ? (
        <button
          onClick={login}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      ) : (
        <>
          <div className="flex gap-4 mb-8">
            <button
              onClick={createStudent}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Add Student
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
              }}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div className="grid gap-4">
            {Array.isArray(students) ? (
              students.map((student) => (
                <div key={student.id} className="border p-4 rounded shadow">
                  <h2 className="font-bold">{student.name}</h2>
                  <p>Age: {student.age} | Email: {student.email}</p>
                </div>
              ))
            ) : (
              <p>Loading students...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
