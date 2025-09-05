import { Model, RelationMappings } from 'objection';
import { User } from '../users/model.js';
import { Category } from '../categories/model.js';

export class Transaction extends Model {
  static tableName = 'transactions';

  id!: number;
  amount!: number;
  description!: string;
  userId!: number;
  categoryId!: number;
  createdAt!: string;
  updatedAt!: string;

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'transactions.user_id',
        to: 'users.id',
      },
    },
    category: {
      relation: Model.BelongsToOneRelation,
      modelClass: Category,
      join: {
        from: 'transactions.category_id',
        to: 'categories.id',
      },
    },
  };
}
