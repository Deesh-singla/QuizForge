import express from "express";
import { PORT } from "./config/env.js";
import connectDb from "./config/db.js";
import authRoutes from "./routers/auth.routes.js";
import userRoutes from "./routers/user.routes.js";
import topicRoutes from "./routers/topic.routes.js"
import questionRoutes from "./routers/questions.router.js";

const app = express();

connectDb();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/topics", topicRoutes);

app.use("/api/questions", questionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

