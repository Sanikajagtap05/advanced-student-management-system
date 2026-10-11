
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:8080/api/students";

function StudentDetails() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStudent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Student not found."
              : "Unable to load student details."
          );
        }

        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message || "Unable to load student details.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          maxWidth: "750px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 3px 15px #1725540d",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#4059d8",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Back to Dashboard
        </Link>

        <h1 style={{ marginTop: "25px", fontSize: "28px" }}>
          Student Details
        </h1>

        {loading ? (
          <p>Loading student details...</p>
        ) : error ? (
          <p style={{ color: "#b91c1c" }}>{error}</p>
        ) : student ? (
          <>
            <div
              style={{
                background: "#eef2ff",
                padding: "25px",
                borderRadius: "12px",
                marginTop: "20px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "45px" }}>🎓</div>
              <h2 style={{ marginBottom: "8px" }}>
                {student.name}
              </h2>
              <p>Student ID: #{student.id}</p>
            </div>

            <div style={{ lineHeight: "2.5" }}>
              <p>
                <strong>Full Name:</strong> {student.name}
              </p>
              <p>
                <strong>Email Address:</strong> {student.email}
              </p>
              <p>
                <strong>Department:</strong> {student.department}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default StudentDetails;
