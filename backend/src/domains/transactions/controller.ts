import { Response } from 'express';
import { Transaction } from './model.js';
import { AuthenticatedRequest } from '../../middlewares/isAuthenticated.js';
import { transactionSchema } from './validators.js';

export const getUserTransactions = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  try {
    const transactions = await Transaction.query()
      .where('user_id', userId)
      .withGraphFetched('category')
      .orderBy('created_at', 'desc');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
};

export const createTransaction = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { error, value } = transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { amount, description, categoryId } = value;

  try {
    const newTransaction = await Transaction.query().insert({
      amount,
      description,
      categoryId,
      userId,
    });
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating transaction' });
  }
};
