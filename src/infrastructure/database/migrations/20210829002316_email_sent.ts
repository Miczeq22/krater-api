/* eslint-disable unicorn/filename-case */
import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('email_sent', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('from').notNullable();
    table.string('to').notNullable();
    table.string('template').notNullable();
    table.string('payload').notNullable();
    table.timestamp('sent_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('email_sent');
}
