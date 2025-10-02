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
    const { password, email } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }
        let user = await usersModel.findOne({ email });
        let admin = await adminModel.findOne({ email });
        if (!user && !admin) {
            return res.status(403).json({ error: 'Invalid email or password' });
        }
        const foundUser = (user || admin)!;
        const userfound = await bcrypt.compare(password, foundUser.password);
        if (!userfound) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: foundUser._id, role: foundUser.role }, JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({ message: "user signed in successfully", token: `Bearer ${token}` });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}