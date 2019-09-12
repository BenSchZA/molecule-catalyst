import { Schema, Document } from 'mongoose';
import { Schemas } from 'src/app.constants';
import { ObjectId } from 'mongodb';
import { Attachment } from 'src/attachment/attachment.schema';
import { User } from 'src/user/user.schema';
import { spreadEnumKeys } from 'src/helpers/spreadEnum';

export interface Project extends IProject {
  id: string;
  marketData?: any;
  vaultData?: any;
}

export enum ProjectSubmissionStatus {
  created,
  accepted,
  rejected,
  started,
  ended
}

interface IProject {
  user: User | ObjectId | string;
  title: string,
  abstract: string,
  featuredImage: Attachment | ObjectId | String,
  context: string,
  approach: string,
  collaborators: Collaborator[],
  researchPhases: ResearchPhase[],
  status: ProjectSubmissionStatus,
  reviewedBy: User | ObjectId | string,
  chainData: ChainData,
}

interface ChainData {
  block: number,
  index: number,
  marketAddress: string,
  vaultAddress: string,
  creatorAddress: string,
}

const defaultChainData: ChainData = {
  block: -1,
  index: -1,
  marketAddress: "0x",
  vaultAddress: "0x",
  creatorAddress: "0x",
}

interface Collaborator {
  fullName: string,
  professionalTitle: string,
  affiliatedOrganisation: string
}

interface ResearchPhase {
  title: string,
  description: string,
  result: string,
  fundingGoal: number,
  duration: number,
}

let CollaboratorSchema = new Schema({
  fullName: { type: String, required: true },
  professionalTitle: { type: String, required: true },
  affiliatedOrganisation: { type: String, required: true },
}, {
    _id: false,
    id: false
  });

let ResearchPhaseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  result: { type: String, required: true },
  fundingGoal: { type: Number, required: true },
  duration: { type: Number, required: true },
}, {
    _id: false,
    id: false
  });

let ChainDataSchema = new Schema({
  block: { type: Number, required: true, default: -1 },
  index: { type: Number, required: true, default: -1 },
  marketAddress: { type: String, required: true, default: "0x" },
  vaultAddress: { type: String, required: true, default: "0x" },
  creatorAddress: { type: String, required: true, default: "0x" },
}, 
{
  _id: false,
  id: false
});

export interface ProjectDocument extends IProject, Document { }

export const ProjectSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: Schemas.User, required: true },
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  featuredImage: { type: Schema.Types.ObjectId, ref: Schemas.Attachment, required: true },
  context: { type: String, required: true },
  approach: { type: String, required: true },
  collaborators: { type: [CollaboratorSchema], required: true },
  researchPhases: { type: [ResearchPhaseSchema], required: true },
  status: { type: Number, required: true, default: ProjectSubmissionStatus.created, enum: [...spreadEnumKeys(ProjectSubmissionStatus)] },
  reviewedBy: { type: Schema.Types.ObjectId, ref: Schemas.User, required: false },
  chainData: { type: ChainDataSchema, required: true, default: defaultChainData },
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