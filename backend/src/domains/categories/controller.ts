import { Request, Response } from 'express';
import { Category } from './model.js';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.query();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};
