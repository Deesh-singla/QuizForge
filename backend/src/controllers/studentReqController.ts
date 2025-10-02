import { Request, Response } from "express";
import { usersModel } from "../models/userSchema.js";
import mongoose from "mongoose";
import { teacherRequestModel } from "../models/teacherRequestSchema.js";

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

const requestToBeTeacher = async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

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
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "User not found" });
        }
        const pendingRequest = await teacherRequestModel.findOne({ userId});
        if (pendingRequest != null) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ error: "request is already pending" });
        }
        await teacherRequestModel.create({ userId });
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ message: "Request sent successfully" });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export { requestToBeTeacher };
