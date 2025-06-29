import { QueryInterface } from 'sequelize';

export async function up(query: QueryInterface) {
  const now = new Date();
  await query.bulkInsert('users', [
    { name: 'Alice', createdAt: now, updatedAt: now },
    { name: 'Bob', createdAt: now, updatedAt: now },
  ]);
}

export async function down(query: QueryInterface) {
  await query.bulkDelete('users', {}, {});
}
