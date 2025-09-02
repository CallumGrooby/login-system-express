import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";

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

UserRouter.post("/signin", (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (!email || !password) {
    return res.json({ status: "FAILED", message: "Empty input field" });
  } else {
    User.find({ email })
      .then((data) => {
        if (data.length) {
          const hashedPassword = data[0].password;
          bcrypt.compare(password, hashedPassword).then((result) => {
            if (result) {
              res.json({ status: "SUCCESS", message: "Sign in sucessful" });
            } else {
              res.json({ status: "FAILED", message: "Empty Invalid Password" });
            }
          });
        }
      })
      .catch((err) => {
        res.json({ status: "FAILED", message: "Invalid Credentals" });
      });
  }
});
