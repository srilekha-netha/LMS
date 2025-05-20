// routes/adminRoutes.ts
import express from "express";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/dashboard", protect(["admin"]), (req, res) => {
  res.send("Welcome Admin!");
});

export default router;
