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
  user: {
    id: string
  };
  title: string,
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
