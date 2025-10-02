import express from "express";
import { PORT } from "./config/env.js";
import { authRouter } from "./Router/authRouter.js";
import connectDb from "./config/db.js";
import { authMiddleWare } from "./middleware/authMiddleware.js";
import { studentRouter } from "./Router/studentRouter.js";
import { adminRouter } from "./Router/adminRouter.js";
import { isAdmin } from "./middleware/roleMiddleware.js";

const app = express();

connectDb();

app.use(express.json())

app.use("/api/auth", authRouter);

app.use("/api/student", authMiddleWare, studentRouter);
app.use("/api/admin", authMiddleWare, isAdmin, adminRouter);

app.listen(PORT, () => {
    console.log(PORT);
});
