import { Schema, Document } from 'mongoose';
import { Schemas } from 'src/app.constants';
import { spreadEnumKeys } from 'src/helpers/spreadEnum';
import { Attachment } from 'src/attachment/attachment.schema';
import { ObjectId } from 'mongodb';

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
  valid: boolean;
  blacklisted: boolean;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  profileImage?: Attachment | ObjectId | string,
  biography?: string,
  professionalTitle?: string,
  affiliatedOrganisation?: string,
}

export interface UserDocument extends IUser, Document { }

export const UserSchema = new Schema({
  ethAddress: { type: String, required: true, unique: true },
  type: { type: Number, required: true, enum: [...spreadEnumKeys(UserType)], default: UserType.Standard },
  valid: { type: Boolean, required: true, default: false },
  blacklisted: { type: Boolean, default: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  profileImage: { type: Schema.Types.ObjectId, ref: Schemas.Attachment, required: false },
  biography: { type: String, required: false },
  professionalTitle: { type: String, required: false },
  affiliatedOrganisation: { type: String, required: false },
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
  }
);

UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});