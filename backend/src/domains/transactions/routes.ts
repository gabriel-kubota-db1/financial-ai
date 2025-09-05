import { Router } from 'express';
import { getUserTransactions, createTransaction } from './controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = Router();

router.get('/', isAuthenticated, getUserTransactions);
router.post('/', isAuthenticated, createTransaction);

export default router;
