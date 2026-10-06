import * as dotenv from 'dotenv';

dotenv.config();

const migrationsDirectory = 'src/database/migrations';
const seedsDirectory = 'src/database/seeds';

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      charset: 'utf8',
      timezone: 'UTC',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: migrationsDirectory,
      tableName: 'migrations',
      stub: 'src/resources/stubs/migration.stub'
    },
    seeds: {
      directory: seedsDirectory,
      stub: 'src/resources/stubs/seed.stub'
    }
  },
  production: {
    client: process.env.DB_CLIENT,
    connection: {
      charset: 'utf8',
      timezone: 'UTC',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: migrationsDirectory,
      tableName: 'migrations'
    },
    seeds: {
      directory: seedsDirectory
    }
  },
  test: {
    client: process.env.DB_CLIENT,
    connection: {
      charset: 'utf8',
      timezone: 'UTC',
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      database: process.env.TEST_DB_NAME
    },
    migrations: {
      directory: migrationsDirectory,
      tableName: 'migrations'
    },
    seeds: {
      directory: seedsDirectory
    }
  }
};
