import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "teacher" | "student";
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role: {
            type: String,
            enum: ["admin", "teacher", "student"],
            default: "student"
        }
    },
    { timestamps: true }
);

userSchema.pre<IUser>("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});


const User = mongoose.model<IUser>("User", userSchema);
export default User;
