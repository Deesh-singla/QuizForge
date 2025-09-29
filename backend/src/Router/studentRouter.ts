import express from "express";
import { requestToBeTeacher } from "../controllers/studentReqController.js";

const studentRouter = express.Router();

studentRouter.post("/request-teacher", requestToBeTeacher)

export { studentRouter };