
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8080/api/students";

function Departments() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load student records.");
        }

        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message || "Unable to load departments.");
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  const departmentCounts = students.reduce((counts, student) => {
    const department = student.department?.trim();

    if (department) {
      counts[department] = (counts[department] || 0) + 1;
    }

    return counts;
  }, {});

  return (
    <main style={{
      minHeight: "100vh",
      padding: "32px",
      background: "#f5f7fb"
    }}>
      <Link
        to="/"
        style={{
          color: "#4059d8",
          textDecoration: "none",
          fontWeight: 600
        }}
      >
        ← Back to Dashboard
      </Link>

      <h1 style={{ marginTop: "24px", fontSize: "32px" }}>
        Departments
      </h1>

      <p style={{ color: "#64748b", marginBottom: "24px" }}>
        View departments and their student counts.
      </p>

      {loading && <p>Loading departments...</p>}

      {error && (
        <p style={{ color: "#b91c1c" }}>{error}</p>
      )}

      {!loading && !error && (
        <>
          <section style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px"
          }}>
            {Object.entries(departmentCounts).map(
              ([department, count]) => (
                <article
                  key={department}
                  style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "14px",
                    boxShadow: "0 3px 15px #1725540d"
                  }}
                >
                  <div style={{ fontSize: "30px" }}>🏢</div>

                  <h2 style={{ marginTop: "14px", fontSize: "20px" }}>
                    {department}
                  </h2>

                  <p style={{ color: "#64748b" }}>
                    {count} {count === 1 ? "student" : "students"}
                  </p>

                  <Link
                    to={`/students?department=${encodeURIComponent(department)}`}
                    style={{
                      display: "inline-block",
                      marginTop: "12px",
                      color: "#4059d8",
                      fontWeight: 600,
                      textDecoration: "none"
                    }}
                  >
                    View students →
                  </Link>
                </article>
              )
            )}
          </section>

          {Object.keys(departmentCounts).length === 0 && (
            <p>No departments found in your student records.</p>
          )}
        </>
      )}
    </main>
  );
}

export default Departments;
