import mongoose from "mongoose";
const id = mongoose.Schema.ObjectId;

const admin = new mongoose.Schema({
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
        default: "admin"
    },
    pendingRequest: [{ type: id, unique: true }]
})

const adminModel = mongoose.model("admin", admin);
export { adminModel };