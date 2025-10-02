import express from "express";
import { approveTeacherRequest, demoteTeacher, getPendingRequest, rejectTeacherRequest } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/teacher-requests", getPendingRequest)

adminRouter.patch("/approve-teacher/:id", approveTeacherRequest);

adminRouter.patch("/reject-teacher/:id", rejectTeacherRequest)

adminRouter.patch("/demote-teacher/:id", demoteTeacher)
export { adminRouter };