

import "./App.css";
import { useEffect, useState } from "react";


function App() {
const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");
    
  useEffect(() => {
  fetch("http://localhost:8080/api/students")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      return response.json();
    })
    .then((data) => setStudents(data))
    .catch((error) => console.error("Error loading students:", error));
}, []);

  
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>StudentHub</h2>
        <p className="sidebar-label">MAIN MENU</p>
        <div className="nav-item active">Dashboard</div>
        <div className="nav-item">Students</div>
        <div className="nav-item">Departments</div>
        <div className="nav-item">Settings</div>
        <div className="sidebar-footer">Student Management System</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Student Dashboard</h1>
          </div>
          <span className="profile">Admin</span>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">ADMINISTRATION</p>
            <h2>Welcome back!</h2>
            <p>Manage student records from one place.</p>
          </div>
          <span className="welcome-icon">🎓</span>
        </section>

        <section className="stats">
          <article className="stat-card">
            <span>Total Students</span>
            <h2>{students.length}</h2>
            <p>Student records</p>
          </article>
          <article className="stat-card">
            <span>Departments</span>
            <h2>
              {new Set(students.map((s) => s.department)).size}
            </h2>
            <p>Unique departments</p>
          </article>
          <article className="stat-card">
            <span>System Status</span>
            <h2 className="status-text">Ready</h2>
            <p>Dashboard is running</p>
          </article>
        </section>

        <section className="student-section">
          <div className="section-heading">
            <div>
              <h2>Student Records</h2>
              <p>View and search student information.</p>
            </div>
            <span className="record-count">
              {filteredStudents.length} records
            </span>
          </div>

          <input
            className="search-input"
            type="text"
            placeholder="Search by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>STUDENT</th>
                  <th>EMAIL</th>
                  <th>DEPARTMENT</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>#{student.id}</td>
                    <td className="student-name">{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <span className="department">
                        {student.department}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
