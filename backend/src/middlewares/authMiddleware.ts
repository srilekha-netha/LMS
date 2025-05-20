import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (roles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
      req.user = decoded;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        res.status(403).json({ message: "Forbidden: Insufficient role" });
        return;
      }

      next(); // ✅ Proceed if everything is fine
    } catch (error) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};
