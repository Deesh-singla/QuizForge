import mongoose from "mongoose";
import { MONGODB_URL } from "./env.js";

export default async function connectDb() {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("database connected successfully");

    } catch {
        throw new Error("could not connect to database");
    }
}