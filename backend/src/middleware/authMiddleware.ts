import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

interface DataType {
    id: string;
    role: string;
}

export async function authMiddleWare(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(400).json({ error: "User is not signed in" });
        return;
    }
    let decoded = jwt.verify(token, JWT_SECRET) as DataType;
    if (!decoded) {
        res.status(400).json({ error: 'User not signed in' });
        return;
    }
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
}