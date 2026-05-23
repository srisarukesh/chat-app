import React, { useState } from "react";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password required!");
      return;
    }

    const url = isRegister
      ? "https://chat-app-production-047e.up.railway.app/api/auth/register"
      : "https://chat-app-production-047e.up.railway.app/api/auth/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      if (isRegister) {
        setError("");
        setIsRegister(false);
        alert("Register success! Now login da!");
      } else {
        onLogin(data.username, data.token);
      }
    } catch (err) {
      setError("Server error da!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#16213e",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          width: "300px",
        }}
      >
        <h2 style={{ color: "#e94560", marginBottom: "24px" }}>
          {isRegister ? "📝 Register" : "🔐 Login"}
        </h2>

        {error && (
          <p
            style={{ color: "#e94560", marginBottom: "12px", fontSize: "14px" }}
          >
            {error}
          </p>
        )}

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#0f3460",
            color: "#fff",
            fontSize: "16px",
            width: "100%",
            marginBottom: "12px",
            boxSizing: "border-box",
          }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#0f3460",
            color: "#fff",
            fontSize: "16px",
            width: "100%",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 32px",
            background: "#e94560",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
            marginBottom: "12px",
          }}
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p
          style={{ color: "#a0aec0", fontSize: "14px", cursor: "pointer" }}
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
        >
          {isRegister
            ? "Already have account? Login"
            : "Don't have account? Register"}
        </p>
      </div>
    </div>
  );
}

export default Login;
