import express from "express";
import {
  getSavingsGoal,
  saveOrUpdateSavingsGoal,
  clearSavingsGoal,
} from "../controllers/savingsGoalController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSavingsGoal);
router.post("/", protect, saveOrUpdateSavingsGoal);
router.delete("/", protect, clearSavingsGoal);

export default router;
