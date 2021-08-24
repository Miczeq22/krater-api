/* eslint-disable unicorn/filename-case */
import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('account_activation_code', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('code').notNullable();
    table.uuid('account_id').notNullable();
    table.timestamp('created_at');
    table.string('status').notNullable();

    table.foreign('account_id').references('id').inTable('account');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('account_activation_code');
}
