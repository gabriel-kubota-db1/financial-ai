import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../../knexfile.js';

export function setupDatabase() {
  const knex = Knex(knexConfig.development);
  Model.knex(knex);
}
