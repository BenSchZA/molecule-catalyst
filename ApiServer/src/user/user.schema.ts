import { Schema, Document } from 'mongoose';
import { Schemas } from 'src/app.constants';
import { spreadEnumKeys } from 'src/helpers/spreadEnum';

export enum UserType {
  Standard,
  ProjectCreator,
  Admin
}

export interface User extends IUser {
  id: string;
}

interface IUser {
  ethAddress: string;
  type: UserType;
  valid: Boolean;
  blacklisted: Boolean;
}

export interface UserDocument extends IUser, Document { }

export const UserSchema = new Schema({
  ethAddress: { type: String, required: true, unique: true },
  type: { type: Number, required: true, enum:[...spreadEnumKeys(UserType)],  default: UserType.Standard },
  blacklisted: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: {
      getters: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = String(ret._id);
        delete ret._id;
        return ret;
      },
      virtuals: true,
    },
    toObject: {
      getters: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = String(ret._id);
        delete ret._id;
        return ret;
      },
    },
  });