import { Response } from "express";
import Topic from "../models/Topic";
import { AuthRequest } from "../middleware/auth.middleware";


export const createTopic = async (req: AuthRequest, res: Response) => {
    try {
        const { title } = req.body;

        const existingTopic = await Topic.findOne({ title });
        if (existingTopic) {
            return res.status(400).json({ message: "Topic already exists" });
        }

        const topic = await Topic.create({
            title,
            createdBy: req.user!.userId
        });

        res.status(201).json({
            message: "Topic created successfully",
            topic
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const getAllTopics = async (_req: AuthRequest, res: Response) => {
    try {
        const topics = await Topic.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: topics.length,
            topics
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

import mongoose from "mongoose";


export const updateTopic = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const { title } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid topic id" });
        }

        const topic = await Topic.findById(id);
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }

        if (
            req.user!.role === "teacher" &&
            topic.createdBy.toString() !== req.user!.userId
        ) {
            return res.status(403).json({
                message: "You can update only your own topics"
            });
        }

        topic.title = title;
        await topic.save();

        res.status(200).json({
            message: "Topic updated successfully",
            topic
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const deleteTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    await topic.deleteOne();

    res.status(200).json({
      message: "Topic deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

