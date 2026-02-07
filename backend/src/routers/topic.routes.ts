import express from "express";
import { createTopic, getAllTopics, updateTopic, deleteTopic } from "../controllers/topic.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = express.Router();

router.post("/", protect, authorize("teacher", "admin"), createTopic);

router.get("/", protect, getAllTopics);

router.put("/:id", protect, authorize("teacher", "admin"), updateTopic);

router.delete("/:id", protect, authorize("admin", "teacher"), deleteTopic);

export default router;
