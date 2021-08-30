/* eslint-disable unicorn/filename-case */
import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('domain_event', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('event_name').notNullable();
    table.string('aggregate_root').notNullable();
    table.uuid('aggregate_root_id').notNullable();
    table.timestamp('occured_on').notNullable();
    table.string('status').notNullable();
    table.string('payload').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('domain_event');
}
