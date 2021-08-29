/* eslint-disable unicorn/filename-case */
import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('article', (table) => {
    table.uuid('id').notNullable().primary();
    table.uuid('author_id').notNullable();
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.timestamp('posted_at').notNullable();
    table.text('status').notNullable();

    table.foreign('author_id').references('id').inTable('account');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('article');
}
