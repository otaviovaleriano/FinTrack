import express from 'express';
import { createExpense, getUserExpenses } from '../controllers/expenseController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserExpenses); 
router.post('/', protect, createExpense); 

export default router;
