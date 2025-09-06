import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { UserRouter } from "./api/User.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Mount the router
app.use("/api/users", UserRouter);

connectDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ message: "Protected route", user: req.user });
});
