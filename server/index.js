if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-khaki-alpha.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "https://chat-app-khaki-alpha.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Chat server running!");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", async (data) => {
    await supabase.from("messages").insert([
      {
        username: data.username,
        message: data.message,
      },
    ]);

    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 3001, () => {
  console.log("Server running on port 3001");
});
