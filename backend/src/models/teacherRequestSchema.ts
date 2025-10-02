import mongoose from "mongoose";

const teacherRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
})

const teacherRequestModel = mongoose.model("teacherRequests", teacherRequestSchema);

export { teacherRequestModel };