import { Request, Response } from "express";
import { adminModel } from "../models/adminSchema.js";
import { ADMIN_EMAIL } from "../config/env.js";

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

export const getPendingRequest = async (req: AuthRequest, res: Response) => {
    try {
        const admin = await adminModel.findOne({ email: ADMIN_EMAIL });
        res.json(admin!.pendingRequest)
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}