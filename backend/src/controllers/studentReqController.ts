import { Request, Response } from "express";
import { usersModel } from "../models/userSchema.js";
import { ADMIN_EMAIL } from "../config/env.js";
import { adminModel } from "../models/adminSchema.js";
import mongoose from "mongoose";

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

const requestToBeTeacher = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await usersModel.findByIdAndUpdate(
            userId,
            { teacherRequest: "pending" },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const admin = await adminModel.findOne({ email: ADMIN_EMAIL });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const alreadyRequested = admin.pendingRequest.some(id => id.toString() === userId);
        console.log(alreadyRequested);

        if (alreadyRequested) {
            return res.status(401).json({ error: "request is already pending" });
        }
        admin.pendingRequest.push(new mongoose.Types.ObjectId(userId));
        await admin.save();
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export { requestToBeTeacher };
