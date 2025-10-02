// backend/src/middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

/**
 * Middleware factory to check if user has required role(s)
 * Must be used AFTER authMiddleWare
 * @param allowedRoles - Array of roles that are allowed
 */
export const requireRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.role) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            if (!allowedRoles.includes(req.role)) {
                return res.status(403).json({ 
                    error: `Access denied. Required role: ${allowedRoles.join(" or ")}` 
                });
            }
            
            next();
        } catch (err) {
            console.error("Error in requireRole middleware:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
};

// Convenience exports
export const isAdmin = requireRole("admin");
export const isTeacher = requireRole("teacher");
export const isTeacherOrAdmin = requireRole("teacher", "admin");