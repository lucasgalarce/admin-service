const dotenv = require('dotenv');
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});
const SSL = process.env.DB_SSL == 1 ? true : false;
module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/modules/**/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  ssl: SSL,
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
