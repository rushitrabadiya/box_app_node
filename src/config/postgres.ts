import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.PG_DB as string,
  process.env.PG_USER as string,
  process.env.PG_PASS,
  {
    host: process.env.PG_HOST,
    port: +(process.env.PG_PORT || 5432),
    dialect: 'postgres',
    logging: false,
  },
);

export const connectPostgres = async () => {
  await sequelize.authenticate();
  console.log('✅ Postgres connected');

  // Automatically create any missing tables or apply column changes
  // based on the current model definitions. `alter: true` compares
  // the database schema with the models and performs the safest
  // possible alteration. Use `force: true` in development only if
  // you want to drop and recreate tables each time.
  await sequelize.sync({ alter: true });
  console.log('✅ Sequelize models synchronized');
};
