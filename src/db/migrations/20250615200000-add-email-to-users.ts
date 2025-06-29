import { QueryInterface, DataTypes } from 'sequelize';

export async function up(query: QueryInterface) {
  await query.addColumn('users', 'email', {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  });
}

export async function down(query: QueryInterface) {
  await query.removeColumn('users', 'email');
}
