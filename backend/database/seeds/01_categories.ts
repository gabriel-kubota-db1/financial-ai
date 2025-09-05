import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('categories').del();

  await knex('categories').insert([
    { id: 1, name: 'Salary' },
    { id: 2, name: 'Groceries' },
    { id: 3, name: 'Rent' },
    { id: 4, name: 'Utilities' },
    { id: 5, name: 'Transport' },
    { id: 6, name: 'Entertainment' },
    { id: 7, name: 'Health' },
    { id: 8, name: 'Other' },
  ]);
}
