import { Model } from 'objection';

export class User extends Model {
  static tableName = 'users';

  id!: number;
  name!: string;
  email!: string;
  password!: string;
  createdAt!: string;
  updatedAt!: string;

  $formatJson(json: any) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }
}
