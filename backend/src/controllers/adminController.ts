import { Request, Response } from "express";
import { usersModel } from "../models/userSchema.js";
import { teacherRequestModel } from "../models/teacherRequestSchema.js";
import mongoose from "mongoose";

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

export const getPendingRequest = async (req: AuthRequest, res: Response) => {
    try {
        const pendingRequests = await teacherRequestModel.find().populate("userId", "username email role");
        res.status(200).json(pendingRequests);
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const handleTeacherRequest = async (
    req: AuthRequest,
    res: Response,
    action: "approve" | "reject" | "demote"
) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const id = req.params.id;

        let userUpdate: any = {};
        let teacherReqUpdate: any = {};

        if (action === "approve") {
            userUpdate = { role: "teacher", teacherRequest: "accepted" };
            teacherReqUpdate = { status: "approved" };
        } else if (action === "reject") {
            userUpdate = { role: "student", teacherRequest: "rejected" };
            teacherReqUpdate = { status: "rejected" };
        } else if (action === "demote") {
            userUpdate = { role: "student", teacherRequest: "none" };
            teacherReqUpdate = { status: "rejected" };
        }

        const user = await usersModel.findByIdAndUpdate(id, userUpdate, { new: true,session });

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "User not found" });
        }

        await teacherRequestModel.findOneAndUpdate(
            { userId: id },
            teacherReqUpdate,
            { new: true,session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: `Request has been ${action}d`
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const approveTeacherRequest = (req: AuthRequest, res: Response) =>
    handleTeacherRequest(req, res, "approve");

export const rejectTeacherRequest = (req: AuthRequest, res: Response) =>
    handleTeacherRequest(req, res, "reject");

export const demoteTeacher = (req: AuthRequest, res: Response) =>
    handleTeacherRequest(req, res, "demote");