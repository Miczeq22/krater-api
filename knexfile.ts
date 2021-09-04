require('dotenv').config();

module.exports = {
  staging: {
    client: 'pg',
    connection: {
      host: process.env.POSTRGRES_HOSTNAME,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: 'dist/infrastructure/database/migrations',
    },
    seeds: {
      directory: 'dist/infrastructure/database/seeds',
    },
  },
  development: {
    client: 'pg',
    connection: {
      host: process.env.POSTRGRES_HOSTNAME,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: 'src/infrastructure/database/migrations',
    },
    seeds: {
      directory: 'src/infrastructure/database/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.POSTRGRES_HOSTNAME,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: 'src/infrastructure/database/migrations',
    },
    seeds: {
      directory: 'src/infrastructure/database/seeds',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: process.env.POSTRGRES_HOSTNAME,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: Number(process.env.POSTGRES_PORT),
    },
    migrations: {
      directory: 'src/infrastructure/database/migrations',
    },
    seeds: {
      directory: 'src/infrastructure/database/seeds',
    },
  },
};
