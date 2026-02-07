import mongoose, { Document } from "mongoose";

export interface IQuestion extends Document {
  question: string;
  options: string[];
  correctOption: number;
  topicId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const questionSchema = new mongoose.Schema<IQuestion>(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (opts: string[]) => opts.length >= 2,
        message: "At least two options are required"
      }
    },
    correctOption: {
      type: Number,
      required: true
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Question = mongoose.model<IQuestion>("Question", questionSchema);
export default Question;
