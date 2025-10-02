import mongoose from "mongoose";

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"],
        default: "student"
    },
    teacherRequest: {
        type: String,
        enum: ["none", "pending", "rejected", "accepted"],
        default: "none"
    }
})

const usersModel = mongoose.model("users", User);

export { usersModel };