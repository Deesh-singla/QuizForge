import express from "express";
import { createQuestion, getQuestionsByTopic } from "../controllers/question.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = express.Router();

router.post("/", protect, authorize("teacher", "admin"), createQuestion);

router.get("/topic/:topicId", protect, getQuestionsByTopic);

export default router;
