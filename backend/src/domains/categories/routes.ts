import { Router } from 'express';
import { getAllCategories } from './controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = Router();

router.get('/', isAuthenticated, getAllCategories);

export default router;
