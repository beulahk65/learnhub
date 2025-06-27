import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        const role = data.user.role;

        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "teacher") navigate("/teacher-dashboard");
        else if (role === "student") navigate("/student-dashboard");
        else setError("❌ Unknown user role");
      } else {
        setError(data.message || "❌ Invalid credentials");
      }
    } catch {
      setError("❌ Failed to login. Please try again.");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage:
          "url('https://i.pinimg.com/736x/fd/81/e0/fd81e018ef60dc3c811fe7cd106942bb.jpg')",
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
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Login
        </h2>

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
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#f0f0f0")
          }
          onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
        >
          Sign In
        </button>

        {error && (
          <p style={{ color: "salmon", marginTop: "1rem", textAlign: "center" }}>
            {error}
          </p>
        )}

        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            color: "#ccc",
          }}
        >
          Don’t have an account?{" "}
          <a
            href="/register"
            style={{
              color: "#ffffff",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Register
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

export default Login;
