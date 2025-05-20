// src/routes/teacherRoutes.ts
import express from "express";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Only accessible to users with the "teacher" role
router.get("/dashboard", protect(["teacher"]), (req, res) => {
  res.send("Teacher Dashboard Accessed");
});

router.post("/create-course", protect(["teacher"]), (req, res) => {
  res.send("Course created by teacher");
});

router.get("/manage-courses", protect(["teacher"]), (req, res) => {
  res.send("Manage teacher's courses");
});

export default router;
