import express from "express";
import { getPendingRequest } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/teacher-requests", getPendingRequest)

export { adminRouter };