import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

enum ProjectSubmissionStatus {
  created,
  accepted,
  rejected,
  started,
  ended
}

interface IProject {
  id: string;
  user: User
  title: string,
  createdAt: string,
  abstract: string,
  featuredImage: string,
  context: string,
  approach: string,
  collaborators: Collaborator[],
  researchPhases: ResearchPhase[],
  status: ProjectSubmissionStatus,
  reviewedBy: string,
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

interface User {
  id: string,
  ethAddress?: string,
  biography?: string,
  affiliatedOrganisation?: string,
  firstName?: string,
  lastName?: string,
  professionalTitle?: string,
  fullName?: string
}

/* --- STATE --- */
interface ProjectsState {

}

/* --- ACTIONS --- */
type ProjectActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type DomainState = ProjectsState;
type DomainActions = ProjectActions;
type Project = IProject

export { RootState, DomainState, DomainActions, Project, ProjectSubmissionStatus };
