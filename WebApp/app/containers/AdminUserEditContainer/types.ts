import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface ProjectDetailsContainerState {
  
}

/* --- ACTIONS --- */
type ProjectDetailsContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = ProjectDetailsContainerState;
type ContainerActions = ProjectDetailsContainerActions;

export { RootState, ContainerState, ContainerActions };

export interface UserData {
  email: string,
  firstName: string,
  lastName: string,
  profileImage: any,
  biography: string,
  professionalTitle: string,
  affiliatedOrganisation: string,
}
