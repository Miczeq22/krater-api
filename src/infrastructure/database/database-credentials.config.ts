require('dotenv').config();

export interface DatabaseConfig {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
}

export const postgresConfig: DatabaseConfig = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTRGRES_HOSTNAME,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
};
