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
  firstName?: string;
  lastName?: string;
  fullName?: string;
  // email?: string;
  profileImage?: { type: Schema.Types.ObjectId, ref: Schemas.Attachment },
  type: UserType;
  isValidated: Boolean;
  valid: Boolean;
  blacklisted: Boolean;
}

export interface UserDocument extends IUser, Document { }

export const UserSchema = new Schema({
  ethAddress: { type: String, required: true, unique: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  // email: { type: String, required: false, unique: true },
  profileImage: { type: Schema.Types.ObjectId, ref: Schemas.Attachment, required: false },
  type: { type: Number, required: true, enum:[...spreadEnumKeys(UserType)],  default: UserType.Standard },
  isValidated: { type: Boolean, default: false },
  valid: { type: Boolean, default: false },
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

UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});
