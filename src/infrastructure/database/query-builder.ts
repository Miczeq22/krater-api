import * as Knex from 'knex';
import { DatabaseConfig, postgresConfig } from './database-credentials.config';

export interface QueryBuilder extends Knex {}

export type DatabaseClient = 'pg';

export const createQueryBuilder = (client: DatabaseClient, config: DatabaseConfig) =>
  Knex.default({
    client,
    connection: config,
  }) as QueryBuilder;

export const postgresQueryBuilder = () => createQueryBuilder('pg', postgresConfig);
