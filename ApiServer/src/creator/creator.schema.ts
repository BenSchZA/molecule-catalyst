import { Schema, Document } from 'mongoose';
import { Schemas } from 'src/app.constants';
import { spreadEnumKeys } from 'src/helpers/spreadEnum';
import { User } from 'src/user/user.schema';
import { ObjectId } from 'mongodb';
import { Attachment } from 'src/attachment/attachment.schema';

export interface CreatorApplication extends ICreatorApplication {
  id: string;
}

export enum CreatorApplicationStatus {
  created,
  awaitingEmailVerification,
  awaitingVerification,
  accepted,
  rejected
}

interface ICreatorApplication {
  user: User | ObjectId | String;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  profileImage: Attachment | ObjectId | String,
  biography: string,
  professionalTitle: string,
  affiliatedOrganisation: string,
  status: CreatorApplicationStatus,
  reviewedBy: User | ObjectId | String,
}

export interface CreatorApplicationDocument extends ICreatorApplication, Document { }

export const CreatorApplicationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: Schemas.User, required: true, unique: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: Schema.Types.ObjectId, ref: Schemas.Attachment, required: false },
  biography: { type: String, required: true },
  professionalTitle: { type: String, required: true },
  affiliatedOrganisation: { type: String, required: true },
  status: { type: Number, required: true, default: CreatorApplicationStatus.created, enum: [...spreadEnumKeys(CreatorApplicationStatus)] },
  reviewedBy: { type: Schema.Types.ObjectId, ref: Schemas.User, required: false }
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
      virtuals: true,
    },
  });

CreatorApplicationSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});
