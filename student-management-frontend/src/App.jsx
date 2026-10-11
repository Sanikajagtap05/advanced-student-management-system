
import "./App.css";
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

const API_URL = "http://localhost:8080/api/students";

const EMPTY_FORM = {
  name: "",
  email: "",
  department: "",
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedDepartment = searchParams.get("department") || "";

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Admin dropdown
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminName = localStorage.getItem("adminName") || "Admin";

  // Load student records
  async function loadStudents() {
    setLoading(true);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load student records.");
      }

      const data = await response.json();
      setStudents(data);
      setError("");
    } catch (err) {
      setError(
        "Unable to load students. Make sure Spring Boot and MySQL are running."
      );
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  // Close dropdown when navigating
  useEffect(() => {
    setAdminMenuOpen(false);
  }, [location.pathname]);

  // Admin menu actions
  function openAdminProfile() {
    setAdminMenuOpen(false);
    navigate("/settings");
  }

  function openAdminSettings() {
    setAdminMenuOpen(false);
    navigate("/settings");
  }

  function handleLogout() {
    const confirmed = window.confirm(
      "Do you want to leave the dashboard?"
    );

    if (confirmed) {
      setAdminMenuOpen(false);
      navigate("/");
    }
  }

  // Handle form input
  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Open Add Student form
  function openAddForm() {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  // Open Edit Student form
  function openEditForm(student) {
    setFormData({
      name: student.name ?? "",
      email: student.email ?? "",
      department: student.department ?? "",
    });

    setEditingId(student.id);
    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Close form
  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError("");
  }

  // Add or update student
  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const isEditing = editingId !== null;
    const url = isEditing
      ? `${API_URL}/${editingId}`
      : API_URL;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
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

      setShowForm(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);

      setMessage(
        isEditing
          ? "Student updated successfully!"
          : "Student added successfully!"
      );

      await loadStudents();
    } catch (err) {
      setError(
        err.message || "Unable to save student. Please try again."
      );
      console.error("Error saving student:", err);
    } finally {
      setSaving(false);
    }
  }

  // Delete student
  async function handleDelete(student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) return;

    setDeletingId(student.id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${student.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
          responseText || "Could not delete the student."
        );
      }

      setStudents((previous) =>
        previous.filter((item) => item.id !== student.id)
      );

      setMessage("Student deleted successfully!");
    } catch (err) {
      setError(err.message || "Unable to delete student.");
      console.error("Error deleting student:", err);
    } finally {
      setDeletingId(null);
    }
  }

  // Search and department filtering
  const filteredStudents = students.filter((student) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      String(student.id).includes(searchTerm) ||
      student.name?.toLowerCase().includes(searchTerm) ||
      student.email?.toLowerCase().includes(searchTerm) ||
      student.department?.toLowerCase().includes(searchTerm);

    const matchesDepartment =
      !selectedDepartment ||
      student.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Count unique departments
  const departmentCount = new Set(
    students
      .map((student) => student.department)
      .filter(Boolean)
  ).size;

  // Available department options
  const departments = [
    ...new Set([
      "Computer Science",
      "Information Technology",
      "Electronics",
      "Mechanical Engineering",
      "Civil Engineering",
      "Other",
      ...students.map((student) => student.department),
      formData.department,
    ]),
  ].filter(Boolean);

  const isStudentsPage = location.pathname === "/students";

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>StudentHub</h2>

        <p className="sidebar-label">MAIN MENU</p>

        <Link
          to="/"
          className={`nav-item ${
            location.pathname === "/" ? "active" : ""
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/students"
          className={`nav-item ${
            isStudentsPage ? "active" : ""
          }`}
        >
          Students
        </Link>

        <Link
          to="/departments"
          className={`nav-item ${
            location.pathname === "/departments" ? "active" : ""
          }`}
        >
          Departments
        </Link>

        <Link
          to="/settings"
          className={`nav-item ${
            location.pathname === "/settings" ? "active" : ""
          }`}
        >
          Settings
        </Link>

        <div className="sidebar-footer">
          Student Management System
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              {isStudentsPage
                ? "STUDENT MANAGEMENT"
                : "OVERVIEW"}
            </p>

            <h1>
              {isStudentsPage
                ? "Students"
                : "Student Dashboard"}
            </h1>
          </div>

          {/* Admin dropdown */}
          <div className="admin-menu-container">
            <button
              type="button"
              className="profile"
              onClick={() =>
                setAdminMenuOpen((previous) => !previous)
              }
              aria-expanded={adminMenuOpen}
              aria-haspopup="menu"
            >
              {adminName}
              <span className="admin-arrow">
                {adminMenuOpen ? "▴" : "▾"}
              </span>
            </button>

            {adminMenuOpen && (
              <div className="admin-dropdown" role="menu">
                <div className="admin-dropdown-header">
                  <div className="admin-avatar">
                    {adminName.charAt(0).toUpperCase()}
                  </div>

                  <div className="admin-user-info">
                    <strong>{adminName}</strong>
                    <small>Administrator</small>
                  </div>
                </div>

                <button
                  type="button"
                  className="admin-menu-item"
                  role="menuitem"
                  onClick={openAdminProfile}
                >
                  <span>👤</span>
                  My Profile
                </button>

                <button
                  type="button"
                  className="admin-menu-item"
                  role="menuitem"
                  onClick={openAdminSettings}
                >
                  <span>⚙️</span>
                  Settings
                </button>

                <div className="admin-menu-divider" />

                <button
                  type="button"
                  className="admin-menu-item logout-item"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <span>↪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Welcome banner */}
        <section className="welcome">
          <div>
            <p className="eyebrow">ADMINISTRATION</p>
            <h2>Welcome back, {adminName}!</h2>
            <p>Manage student records from one place.</p>
          </div>

          <span className="welcome-icon">🎓</span>
        </section>

        {/* Success message */}
        {message && (
          <div
            className="app-message success-message"
            role="status"
          >
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className="app-message error-message"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Dashboard statistics */}
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
              {loading
                ? "Loading..."
                : error
                  ? "Check API"
                  : "Ready"}
            </h2>
            <p>Dashboard status</p>
          </article>
        </section>

        {/* Student records */}
        <section className="student-section">
          <div className="section-heading">
            <div>
              <h2>
                {selectedDepartment
                  ? `${selectedDepartment} Students`
                  : isStudentsPage
                    ? "All Students"
                    : "Student Records"}
              </h2>

              <p>
                View, search, add, edit, and delete student information.
              </p>
            </div>

            <button
              type="button"
              className="add-student-btn"
              onClick={showForm ? closeForm : openAddForm}
              disabled={saving}
            >
              {showForm ? "Cancel" : "+ Add Student"}
            </button>
          </div>

          {/* Add/Edit form */}
          {showForm && (
            <form
              className="student-form"
              onSubmit={handleSubmit}
            >
              <h3>
                {editingId !== null
                  ? `Edit Student #${editingId}`
                  : "Add New Student"}
              </h3>

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

                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="add-student-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Update Student"
                      : "Save Student"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Search */}
          <input
            className="search-input"
            type="text"
            placeholder="Search by ID, name, email, or department..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {/* Student table */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>STUDENT</th>
                  <th>EMAIL</th>
                  <th>DEPARTMENT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      Loading students...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>#{student.id}</td>

                      <td className="student-name">
                        {student.name}
                      </td>

                      <td>{student.email}</td>

                      <td>
                        <span className="department">
                          {student.department}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <Link
                            to={`/students/${student.id}`}
                            className="view-btn"
                          >
                            View Details
                          </Link>

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() => openEditForm(student)}
                            disabled={
                              saving || deletingId !== null
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(student)}
                            disabled={
                              saving || deletingId !== null
                            }
                          >
                            {deletingId === student.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
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
