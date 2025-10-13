import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (!name || !email || !password) {
      return res.json({ status: "FAILED", message: "Empty input field" });
    }
    if (!/^[a-zA-Z]*$/.test(name)) {
      return res.json({ status: "FAILED", message: "Invalid Name Entered" });
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.json({ status: "FAILED", message: "Invalid Email Entered" });
    }
    if (password.length < 8) {
      return res.json({ status: "FAILED", message: "Password is too short" });
    }

    // Check if user exists
    const existing = await User.find({ email });
    if (existing.length) {
      return res.json({
        status: "FAILED",
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    // Saves to the database
    const savedUser = await newUser.save();
    res.json({
      status: "SUCCESS",
      message: "New user successfully created",
      data: savedUser,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: "FAILED",
      message: "An error occurred creating the user",
    });
  }
});

UserRouter.post("/signin", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!email || !password) {
      return res.json({ status: "FAILED", message: "Empty input field" });
    }

    // 1) Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "FAILED", message: "User not found" });
    }

    // 2) Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ status: "FAILED", message: "Invalid password" });
    }

    //3) Create JWT Token
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 3) Success
    res.json({ status: "SUCCESS", message: "Sign in successful", data: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred during sign in",
    });
  }
});
