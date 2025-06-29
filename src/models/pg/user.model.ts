import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/postgres';
import { BaseAttributes } from '../../interfaces/timestamps.interface';

export interface PgUserAttributes extends BaseAttributes {
  id?: number;
  name: string;
  email?: string;
  passwordHash?: string;
  phone: string;
  otp?: string | null;
  otpExpires?: Date | null;
  isPhoneVerified?: boolean;
  emailVerificationToken?: string | null;
  isEmailVerified?: boolean;
  refreshToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  createdBy?: string | number;
  updatedBy?: string | number;
  deletedBy?: string | number;
}

interface PgUserCreation
  extends Optional<
    PgUserAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedBy'
  > {}

export class PgUser extends Model<PgUserAttributes, PgUserCreation> implements PgUserAttributes {
  public id!: number;
  public name!: string;
  public email?: string;
  public passwordHash?: string;
  public phone!: string;
  public otp?: string | null;
  public otpExpires?: Date | null;
  public isPhoneVerified?: boolean;
  public emailVerificationToken?: string | null;
  public isEmailVerified?: boolean;
  public refreshToken?: string | null;
  public passwordResetToken?: string | null;
  public passwordResetExpires?: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date;
  public createdBy?: string | number;
  public updatedBy?: string | number;
  public deletedBy?: string | number;
}
PgUser.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    otp: { type: DataTypes.STRING, allowNull: true },
    otpExpires: { type: DataTypes.DATE, allowNull: true },
    isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    emailVerificationToken: { type: DataTypes.STRING, allowNull: true },
    isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    refreshToken: { type: DataTypes.STRING, allowNull: true },
    passwordResetToken: { type: DataTypes.STRING, allowNull: true },
    passwordResetExpires: { type: DataTypes.DATE, allowNull: true },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    updatedBy: { type: DataTypes.INTEGER, allowNull: true },
    deletedBy: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, modelName: 'PgUser', tableName: 'users', timestamps: true },
);
