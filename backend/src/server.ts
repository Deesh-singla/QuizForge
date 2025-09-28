import express from "express";
import { PORT } from "./config/env.js";
import { authRouter } from "./Router/authRouter.js";
import connectDb from "./config/db.js";

const app = express();

connectDb();

app.use(express.json())

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(PORT);
});
