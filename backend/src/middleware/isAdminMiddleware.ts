import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
        req.userId = decoded.id;
        req.role = decoded.role;

        if (req.role !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
