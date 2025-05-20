// src/routes/studentRoutes.ts
import express from "express";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Only accessible to users with the "student" role
router.get("/dashboard", protect(["student"]), (req, res) => {
  res.send("Student Dashboard Accessed");
});

router.get("/courses", protect(["student"]), (req, res) => {
  res.send("List of student courses");
});

router.get("/profile", protect(["student"]), (req, res) => {
  res.send("Student profile info");
});

export default router;
