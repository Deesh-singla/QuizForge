import { Request, Response } from "express";
import { usersModel } from "../models/userSchema.js";
import mongoose from "mongoose";
import { teacherRequestModel } from "../models/teacherRequestSchema.js";

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

export const requestToBeTeacher = async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { userId, role } = req;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (role === "teacher") {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "You are already a teacher" });
        }
        if (role == "admin") {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                error: "Admins cannot request teacher access"
            });
        }

        const pendingRequest = await teacherRequestModel.findOne({ userId }).session(session);
        if (pendingRequest && pendingRequest.status !== "rejected") {
            return res.status(409).json({ error: "Request is already pending" });
        }

        const user = await usersModel.findByIdAndUpdate(
            userId,
            { teacherRequest: "pending" },
            { new: true, session }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!pendingRequest) {
            await teacherRequestModel.create([{ userId }], { session });
        } else if (pendingRequest.status === "rejected") {
            await teacherRequestModel.updateOne({ userId }, { status: "pending" }, { session });
        }

        await session.commitTransaction();
        return res.status(200).json({ message: "Request sent successfully" });

    } catch (err) {
        await session.abortTransaction();
        console.error("Error in requestToBeTeacher:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        session.endSession();
    }
};
