import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Login from "./Login";

const socket = io("https://chat-app-production-047e.up.railway.app");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogin = (user, tok) => {
    setUsername(user);
    setToken(tok);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setToken("");
    setMessages([]);
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", { username, message });
      setMessage("");
    }
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          background: "#16213e",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#0f3460",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>💬</span>
            <div>
              <h2 style={{ color: "#fff", margin: 0, fontSize: "18px" }}>
                Chat App
              </h2>
              <span style={{ color: "#e94560", fontSize: "13px" }}>
                ● Online as {username}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "#e94560",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            height: "420px",
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {messages.map((msg, i) => {
            const isMe = msg.username === username;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    background: isMe ? "#e94560" : "#0f3460",
                    color: "#fff",
                    padding: "10px 16px",
                    borderRadius: isMe
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    maxWidth: "70%",
                    fontSize: "14px",
                  }}
                >
                  {!isMe && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#a0aec0",
                        marginBottom: "4px",
                      }}
                    >
                      {msg.username}
                    </div>
                  )}
                  {msg.message}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "16px",
            background: "#0f3460",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#16213e",
              color: "#fff",
              fontSize: "14px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "12px 20px",
              background: "#e94560",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
