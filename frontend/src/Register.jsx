import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('https://i.pinimg.com/736x/fd/81/e0/fd81e018ef60dc3c811fe7cd106942bb.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "2rem",
          borderRadius: "1rem",
          color: "white",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", textAlign: "center" }}>
          Register
        </h2>

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          style={{
            marginTop: "1.5rem",
            width: "100%",
            backgroundColor: "white",
            color: "black",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
        >
          Create Account
        </button>
        <p style={{ marginTop: "1rem", textAlign: "center", color: "#ccc" }}>
  Already have an account?{" "}
  <a
    href="/login"
    style={{
      color: "#ffffff",
      textDecoration: "underline",
      fontWeight: "bold",
    }}
  >
    Login
  </a>
</p>

      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  margin: "0.5rem 0 1rem 0",
  borderRadius: "0.5rem",
  border: "none",
  fontSize: "1rem",
};

export default Register;
