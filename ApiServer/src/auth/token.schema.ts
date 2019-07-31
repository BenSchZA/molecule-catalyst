import { Schema, Document } from 'mongoose';
import { Schemas } from 'src/app.constants';
import { ObjectId } from 'bson';
import { User } from 'src/user/user.schema';

interface IToken {
  userId: ObjectId | User
  token: string,
  createdAt: Date,
}

export interface Token extends IToken {
  id: string,
}

export interface TokenDocument extends IToken, Document { }

export const TokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: Schemas.User },
  token: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});