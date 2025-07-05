import { Schema, model, Document, Types } from 'mongoose';
import { IToken, TokenType } from '../../interfaces/token.interface';
import { TOKEN_TYPES } from '../../constants/app';

export interface ITokenDocument extends Document, IToken {
  userId: Types.ObjectId;
  expiryDate: Date;
  token: string;
  name: TokenType;
}

const tokenSchema = new Schema<ITokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiryDate: { type: Date, required: true },
    token: { type: String, required: true, unique: true, trim: true },
    name: {
      type: String,
      enum: Object.values(TOKEN_TYPES),
      required: true,
    },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  },

  { timestamps: true },
);

// Ensure the schema is properly indexed for performance
tokenSchema.index({ userId: 1, name: 1, expiryDate: 1 });
tokenSchema.index({ userId: 1, name: 1 });

export const TokenModel = model<ITokenDocument>('Token', tokenSchema);
