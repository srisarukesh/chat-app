const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  if (existing && existing.length > 0) {
    return res.status(400).json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from("users")
    .insert([{ username, password: hashedPassword }]);

  if (error) return res.status(500).json({ message: "Register failed!" });

  res.json({ message: "Register success!" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  if (!users || users.length === 0) {
    return res.status(400).json({ message: "User not found!" });
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Wrong password!" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token, username });
});

module.exports = router;
