import { ApplicationRootState } from 'types';
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';


export interface ProjectData {
  title: string,
  abstract: string,
  featuredImage: string,
  context: string,
  approach: string,
  collaborators: Collaborator[],
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
  featuredImage?: string,
  context?: string,
  approach?: string,
  collaborators?: Collaborator[],
  campaignTitle?: string,
  campaignDescription?: string,
  researchPhases?: ResearchPhase[],
}

/* --- ACTIONS --- */
type CreateProjectContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = CreateProjectContainerState;
type ContainerActions = CreateProjectContainerActions;

export { RootState, ContainerState, ContainerActions };
