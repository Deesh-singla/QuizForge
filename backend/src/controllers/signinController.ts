import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { usersModel } from "../models/userSchema.js";
import bcrypt from "bcrypt"
import { JWT_SECRET } from "../config/env.js";
import { adminModel } from "../models/adminSchema.js";
interface User {
    username: string;
    email: string;
    password: string;
    role?: string;
}

export const signinUser = async (req: Request, res: Response) => {
    const { username, password, email, role } = req.body;
    try {
        let user = await usersModel.findOne({ email });
        let admin = await adminModel.findOne({ email });
        if (!user && !admin) {
            return res.status(403).json({ error: 'User does not exist' });
        }
        const foundUser = (user || admin)!;
        const userfound = await bcrypt.compare(password, foundUser.password);
        if (!userfound) {
            res.status(403).json({ error: 'Username,email and password does not match' });
        }
        const token = jwt.sign({ id: foundUser._id, role: foundUser.role }, JWT_SECRET);
        return res.status(200).json({ message: "user signed in successfu", token: `Bearer ${token}` });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}