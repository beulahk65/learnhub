// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Landing from "./Landing"; // ✅ correct
import Register from "./Register";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
    </Routes>
  );
}

export default App;
