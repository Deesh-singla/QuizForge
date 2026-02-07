import mongoose, { Document } from "mongoose";

export interface ITopic extends Document {
    title: string;
    createdBy: mongoose.Types.ObjectId;
}

const topicSchema = new mongoose.Schema<ITopic>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

const Topic = mongoose.model<ITopic>("Topic", topicSchema);
export default Topic;
