import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorize =
    (...allowedRoles: Array<"admin" | "teacher" | "student">) =>
        (req: AuthRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.status(401).json({ message: "Not authenticated" });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Access denied: insufficient permissions"
                });
            }

            next();
        };
