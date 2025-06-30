import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/postgres';
import { ISlot, ISlotCreation } from '../../interfaces/slot.interface';

export class PgSlot extends Model<ISlot, ISlotCreation> implements ISlot {
  public id!: number;
  public slotNumber!: number;
  public status!: 'available' | 'occupied' | 'maintenance';
  public vehicleType!: 'car' | 'bike' | 'truck';
  public price!: number;
  public isReserved!: boolean;
  public reservedUntil?: Date;
  public vehicleId?: string;
  public userId?: number;
  public lastOccupiedAt?: Date;
  public lastVacatedAt?: Date;
  public totalOccupancyTime?: number;
  public totalRevenue?: number;
  public notes?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

PgSlot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slotNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'maintenance'),
      allowNull: false,
      defaultValue: 'available',
    },
    vehicleType: {
      type: DataTypes.ENUM('car', 'bike', 'truck'),
      allowNull: false,
      defaultValue: 'car',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    isReserved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reservedUntil: {
      type: DataTypes.DATE,
    },
    vehicleId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    lastOccupiedAt: {
      type: DataTypes.DATE,
    },
    lastVacatedAt: {
      type: DataTypes.DATE,
    },
    totalOccupancyTime: {
      type: DataTypes.INTEGER,
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(10, 2),
    },
    notes: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
    },
    updatedBy: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'slots',
    tableName: 'slots',
    timestamps: true,
    indexes: [
      { fields: ['slotNumber'], unique: true },
      { fields: ['status'] },
      { fields: ['vehicleType'] },
      { fields: ['isReserved'] },
      { fields: ['userId'] },
    ],
  },
);
