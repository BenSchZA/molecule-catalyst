import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

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

/* --- STATE --- */
interface CreateProjectContainerState {
  readonly default: any;
}

/* --- ACTIONS --- */
type CreateProjectContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = CreateProjectContainerState;
type ContainerActions = CreateProjectContainerActions;

export { RootState, ContainerState, ContainerActions };
