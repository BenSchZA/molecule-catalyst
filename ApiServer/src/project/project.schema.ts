import { Schema, Document } from 'mongoose';
import { Schemas } from 'src/app.constants';
import { ObjectId } from 'mongodb';
import { Attachment } from 'src/attachment/attachment.schema';

export interface Project extends IProject {
  id: string;
}

interface IProject {
  title: string,
  abstract: string,
  featuredImage: Attachment | ObjectId | String,
  context: string,
  approach: string,
  collaborators: Collaborator[],
  campaignTitle: string,
  campaignDescription: string,
  researchPhases: ResearchPhase[]
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
  duration: number
}

export interface ProjectDocument extends IProject, Document { }

export const ProjectSchema = new Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  featuredImage: { type: Schema.Types.ObjectId, ref: Schemas.Attachment, required: true },
  context: { type: String, required: true },
  approach: { type: String, required: true },
  collaborators: Collaborator[],
  campaignTitle: { type: String, required: true },
  campaignDescription: { type: String, required: true },
  researchPhases: ResearchPhase[]
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