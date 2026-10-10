import "./App.css";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  async function loadStudents() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load student records.");
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(
        "Unable to load students. Make sure Spring Boot is running."
      );
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          responseText || "Could not save the student."
        );
      }

      setFormData({
        name: "",
        email: "",
        department: "",
      });

      setShowForm(false);
      setMessage("Student added successfully!");
      await loadStudents();
    } catch (err) {
      setError(
        err.message || "Unable to save student. Please try again."
      );
      console.error("Error adding student:", err);
    } finally {
      setSaving(false);
    }
  }

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const departmentCount = new Set(
    students.map((student) => student.department)
  ).size;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>StudentHub</h2>
        <p className="sidebar-label">MAIN MENU</p>
        <div className="nav-item active">Dashboard</div>
        <div className="nav-item">Students</div>
        <div className="nav-item">Departments</div>
        <div className="nav-item">Settings</div>
        <div className="sidebar-footer">
          Student Management System
        </div>
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

        {message && (
          <div className="app-message success-message" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="app-message error-message" role="alert">
            {error}
          </div>
        )}

        <section className="stats">
          <article className="stat-card">
            <span>Total Students</span>
            <h2>{students.length}</h2>
            <p>Student records</p>
          </article>

          <article className="stat-card">
            <span>Departments</span>
            <h2>{departmentCount}</h2>
            <p>Unique departments</p>
          </article>

          <article className="stat-card">
            <span>System Status</span>
            <h2 className="status-text">
              {loading ? "Loading..." : error ? "Check API" : "Ready"}
            </h2>
            <p>Dashboard status</p>
          </article>
        </section>

        <section className="student-section">
          <div className="section-heading">
            <div>
              <h2>Student Records</h2>
              <p>View and search student information.</p>
            </div>

            <button
              type="button"
              className="add-student-btn"
              onClick={() => {
                setMessage("");
                setError("");
                setShowForm((previous) => !previous);
              }}
            >
              {showForm ? "Cancel" : "+ Add Student"}
            </button>
          </div>

          {showForm && (
            <form className="student-form" onSubmit={handleSubmit}>
              <h3>Add New Student</h3>

              <div className="form-field">
                <label htmlFor="name">Student Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  maxLength={150}
                />
              </div>

              <div className="form-field">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select department</option>
                  <option value="Computer Science">
                    Computer Science
                  </option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Electronics">
                    Electronics
                  </option>
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Civil Engineering">
                    Civil Engineering
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="add-student-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Student"}
              </button>
            </form>
          )}

          <input
            className="search-input"
            type="text"
            placeholder="Search by name, email, or department..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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
                {loading ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      Loading students...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
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
                  ))
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