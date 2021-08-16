/* eslint-disable unicorn/filename-case */
import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('account', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('email').notNullable().unique();
    table.text('password').notNullable();
    table.timestamp('registration_date').notNullable();
    table.timestamp('email_confirmation_date').nullable();
    table.string('status').notNullable();
    table.string('nickname').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('account');
}
