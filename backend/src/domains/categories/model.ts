import { Model } from 'objection';

export class Category extends Model {
  static tableName = 'categories';

  id!: number;
  name!: string;
}
