import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateToken;
