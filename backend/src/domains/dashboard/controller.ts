import { Response } from 'express';
import { Transaction } from '../transactions/model.js';
import { AuthenticatedRequest } from '../../middlewares/isAuthenticated.js';

export const getDashboardData = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const transactions = await Transaction.query().where('user_id', userId).withGraphFetched('category');

    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalBalance = totalIncome + totalExpense;

    const balanceByCategoryMap = new Map<number, { categoryName: string; balance: number }>();

    transactions.forEach(t => {
      const categoryId = t.categoryId;
      const categoryName = (t as any).category.name;
      const amount = Number(t.amount);

      if (!balanceByCategoryMap.has(categoryId)) {
        balanceByCategoryMap.set(categoryId, { categoryName, balance: 0 });
      }
      const current = balanceByCategoryMap.get(categoryId)!;
      current.balance += amount;
    });

    const balanceByCategory = Array.from(balanceByCategoryMap.entries()).map(([categoryId, data]) => ({
      categoryId,
      ...data,
    }));

    res.json({
      totalBalance,
      totalIncome,
      totalExpense,
      balanceByCategory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};
