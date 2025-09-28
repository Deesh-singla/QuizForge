import { Request, Response } from "express";
import { userValidator } from "../validators/userValidator.js";
import { usersModel } from "../models/userSchema.js";
import bcrypt from "bcrypt"

interface User {
    username: string;
    email: string;
    password: string;
    role?: string;
}

const checkUserExists = async (email: string): Promise<boolean> => {
    const user = await usersModel.findOne({ email });
    return user != null;
};

const createNewUser = async (data: User): Promise<void> => {
    const hashPass=await bcrypt.hash(data.password,10);
    await usersModel.create({
        username: data.username,
        password: hashPass,
        email: data.email,
        role: "student",
    });
};

export const addUser = async (req: Request, res: Response) => {
    try {
        const parsedData = userValidator.safeParse(req.body);

        if (!parsedData.success) {
            const error = parsedData.error.issues[0].message;
            return res.status(400).json({ error });
        }

        const { username, email, password } = parsedData.data;
        if (await checkUserExists(email)) {
            return res.status(409).json({ error: "User already exists with this username" });
        }

        await createNewUser({ username, email, password });
        return res.status(201).json({ message: "User added successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
