import express from "express";
import { addUser } from "../controllers/signupController.js";
import { signinUser } from "../controllers/signinController.js";

const authRouter = express.Router();

authRouter.post("/signup",addUser)

authRouter.post("/signin",signinUser)

export { authRouter };