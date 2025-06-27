import React from "react";

const Landing = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* Background Image */}
      <img
        src="https://i.pinimg.com/736x/fd/81/e0/fd81e018ef60dc3c811fe7cd106942bb.jpg"
        alt="background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      {/* Foreground Text */}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "2rem",
          borderRadius: "1rem",
          maxWidth: "800px",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Welcome to LearnHub
        </h1>

        <p
          style={{
            color: "white",
            fontSize: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          Empower your learning journey with curated courses and expert mentors.
        </p>

        <a
          href="/register"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            backgroundColor: "white",
            color: "black",
            borderRadius: "0.5rem",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Landing;
