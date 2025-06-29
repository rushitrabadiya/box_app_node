// src/db/config.js
module.exports = {
  development: {
    url:
      process.env.DATABASE_URL ||
      `postgres://${process.env.PG_USER}:${process.env.PG_PASS}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`,
    dialect: 'postgres',
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
};
