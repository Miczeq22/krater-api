/* eslint-disable unicorn/filename-case */
import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('article_comment', (table) => {
    table.uuid('id').notNullable().primary();
    table.uuid('author_id').notNullable();
    table.uuid('article_id').notNullable();
    table.text('content').notNullable();
    table.timestamp('posted_at').notNullable();

    table.foreign('author_id').references('id').inTable('account');
    table.foreign('article_id').references('id').inTable('article');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('article_comment');
}
