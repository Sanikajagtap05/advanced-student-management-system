
import { useState } from "react";
import { Link } from "react-router-dom";

function Settings() {
  const [adminName, setAdminName] = useState(
    () => localStorage.getItem("adminName") || "Admin"
  );

  const [saved, setSaved] = useState(false);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  function handleSave(event) {
    event.preventDefault();

    const name = adminName.trim();

    if (!name) {
      alert("Please enter an administrator name.");
      return;
    }

    localStorage.setItem("adminName", name);
    setAdminName(name);
    setSaved(true);
  }

  function handleThemeChange() {
    const newTheme = !darkMode;

    setDarkMode(newTheme);
    localStorage.setItem("darkMode", String(newTheme));
  }

  const pageStyle = {
    minHeight: "100vh",
    padding: "32px",
    background: darkMode ? "#0f172a" : "#f5f7fb",
    color: darkMode ? "#f8fafc" : "#1e293b",
    transition: "background 0.3s ease, color 0.3s ease",
  };

  const cardStyle = {
    background: darkMode ? "#1e293b" : "#ffffff",
    color: darkMode ? "#f8fafc" : "#1e293b",
    padding: "24px",
    borderRadius: "14px",
    maxWidth: "650px",
    marginBottom: "24px",
    boxShadow: "0 3px 15px #1725540d",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: `1px solid ${darkMode ? "#475569" : "#d1d5db"}`,
    borderRadius: "8px",
    fontSize: "15px",
    background: darkMode ? "#0f172a" : "#ffffff",
    color: darkMode ? "#f8fafc" : "#1e293b",
  };

  const buttonStyle = {
    marginTop: "18px",
    padding: "11px 20px",
    background: "#4059d8",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  };

  return (
    <main style={pageStyle}>
      <Link
        to="/"
        style={{
          color: darkMode ? "#a5b4fc" : "#4059d8",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        ← Back to Dashboard
      </Link>

      <h1 style={{ marginTop: "24px", fontSize: "32px" }}>
        Settings
      </h1>

      <p
        style={{
          color: darkMode ? "#cbd5e1" : "#64748b",
          marginBottom: "28px",
        }}
      >
        Manage your administrator profile and system information.
      </p>

      {/* Admin Profile */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: "21px", marginBottom: "8px" }}>
          Admin Profile
        </h2>

        <p style={{ color: darkMode ? "#cbd5e1" : "#64748b" }}>
          Change the name displayed for the administrator.
        </p>

        <form onSubmit={handleSave}>
          <label
            htmlFor="adminName"
            style={{
              display: "block",
              marginTop: "20px",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Administrator Name
          </label>

          <input
            id="adminName"
            type="text"
            value={adminName}
            onChange={(event) => {
              setAdminName(event.target.value);
              setSaved(false);
            }}
            placeholder="Enter administrator name"
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Save Settings
          </button>

          {saved && (
            <p style={{ color: "#22c55e", marginTop: "12px" }}>
              Settings saved successfully!
            </p>
          )}
        </form>
      </section>

      {/* Appearance Settings */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: "21px", marginBottom: "8px" }}>
          Appearance
        </h2>

        <p style={{ color: darkMode ? "#cbd5e1" : "#64748b" }}>
          Choose your preferred application theme.
        </p>

        <button
          type="button"
          onClick={handleThemeChange}
          style={buttonStyle}
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>

        <p style={{ marginTop: "12px" }}>
          Current theme: <strong>{darkMode ? "Dark" : "Light"}</strong>
        </p>
      </section>

      {/* System Information */}
      <section style={cardStyle}>
        <h2 style={{ fontSize: "21px", marginBottom: "16px" }}>
          System Information
        </h2>

        <p>
          <strong>Application:</strong> Student Management System
        </p>

        <p>
          <strong>Frontend:</strong> React + Vite
        </p>

        <p>
          <strong>Backend:</strong> Spring Boot
        </p>

        <p>
          <strong>Student API:</strong> localhost:8080/api/students
        </p>
      </section>
    </main>
  );
}

export default Settings;
