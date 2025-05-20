// models/User.ts
import mongoose from "mongoose";

export type Role = "student" | "teacher" | "admin";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], required: true },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
