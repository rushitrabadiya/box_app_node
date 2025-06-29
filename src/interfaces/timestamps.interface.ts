/**
 * Common audit columns that every model/table/collection should have.
 * All fields are optional so that every model can decide which ones
 * Sequelize (or Mongoose) will set automatically.
 */
export interface BaseAttributes {
  /** When the record was first created */
  createdAt?: Date;
  /** When the record was last updated */
  updatedAt?: Date;

  /** Who created the record (user id / username) */
  createdBy?: string | number;
  /** Who last updated the record */
  updatedBy?: string | number;
  /** Who deleted/soft-deleted the record */
  deletedBy?: string | number;
}

// Backwards-compatibility alias: existing code that imports `Timestamps`
// will keep working while we migrate.
export type Timestamps = BaseAttributes;
