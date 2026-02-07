import { Response } from "express";
import mongoose from "mongoose";
import Question from "../models/Question";
import Topic from "../models/Topic";
import { AuthRequest } from "../middleware/auth.middleware";

export const createQuestion = async (req: AuthRequest, res: Response) => {
    try {
        const { question, options, correctOption, topicId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(topicId)) {
            return res.status(400).json({ message: "Invalid topic id" });
        }

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }

        if (correctOption < 0 || correctOption >= options.length) {
            return res.status(400).json({
                message: "correctOption index is invalid"
            });
        }

        const newQuestion = await Question.create({
            question,
            options,
            correctOption,
            topicId,
            createdBy: req.user!.userId
        });

        res.status(201).json({
            message: "Question created successfully",
            question: newQuestion
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const getQuestionsByTopic = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const topicId  = req.params.topicId as string;

        if (!mongoose.Types.ObjectId.isValid(topicId)) {
            return res.status(400).json({ message: "Invalid topic id" });
        }

        const questions = await Question.find({ topicId }).select(
            "-correctOption"
        );

        res.status(200).json({
            count: questions.length,
            questions
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

