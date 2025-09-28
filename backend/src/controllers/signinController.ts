import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { usersModel } from "../models/userSchema.js";
import bcrypt from "bcrypt"
import { JWT_SECRET } from "../config/env.js";
interface User {
    username: string;
    email: string;
    password: string;
    role?: string;
}

export const signinUser = async (req: Request, res: Response) => {
    const { username, password, email, role } = req.body;
    try {
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ error: 'User does not exist' });
        }
        const userfound = bcrypt.compare(password, user.password);
        if (!userfound) {
            res.status(403).json({ error: 'Username,email and password does not match' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
        return res.status(200).json({ message: "user signed in successfu", token });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}