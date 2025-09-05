import { Router } from 'express';
import { getDashboardData } from './controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = Router();

router.get('/', isAuthenticated, getDashboardData);

export default router;
