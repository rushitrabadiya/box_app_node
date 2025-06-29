import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres' as const,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432'),
  database: process.env.PG_DB,
  username: process.env.PG_USER,
  password: process.env.PG_PASS,
  logging: false,
});

export default sequelize;
