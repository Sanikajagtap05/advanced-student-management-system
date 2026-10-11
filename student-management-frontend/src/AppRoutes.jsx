
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import StudentDetails from "./StudentDetails.jsx";
import Departments from "./Departments.jsx";
import Settings from "./Settings.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/students" element={<App />} />
      <Route path="/students/:id" element={<StudentDetails />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
