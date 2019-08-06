import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

export enum ProjectSubmissionStatus {
  created,
  accepted,
  rejected,
  started,
  ended
}

export interface ProjectData {
  title: string,
  abstract: string,
  featuredImage: string,
  context: string,
  approach: string,
  collaborators: Collaborator[],
  campaignTitle: string,
  campaignDescription: string,
  researchPhases: ResearchPhase[]
}

export interface Collaborator {
  fullName: string,
  professionalTitle: string,
  affiliatedOrganisation: string
}

export interface ResearchPhase {
  title: string,
  description: string,
  result: string,
  fundingGoal: number,
  duration: number
}

/* --- STATE --- */
interface CreateProjectContainerState {
  title?: string,
  abstract?: string,
  featuredImage?: ObjectId | string,
  context?: string,
  approach?: string,
  collaborators?: Collaborator[],
  campaignTitle?: string,
  campaignDescription?: string,
  researchPhases?: ResearchPhase[],
  status?: ProjectSubmissionStatus,
}

/* --- ACTIONS --- */
type CreateProjectContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = CreateProjectContainerState;
type ContainerActions = CreateProjectContainerActions;

export { RootState, ContainerState, ContainerActions };
