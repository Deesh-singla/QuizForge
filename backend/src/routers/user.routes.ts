import express from "express";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.json({
    message: "Authenticated user",
    user: (req as any).user
  });
});

router.get(
  "/student-only",
  protect,
  authorize("student"),
  (req, res) => {
    res.json({ message: "Welcome student 🎓" });
  }
);

router.get(
  "/teacher-only",
  protect,
  authorize("teacher", "admin"),
  (req, res) => {
    res.json({ message: "Welcome teacher 👨‍🏫" });
  }
);

export default router;
