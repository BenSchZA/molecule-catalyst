import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface ProjectDetailsContainerState {
  readonly txInProgress: boolean;
}

/* --- ACTIONS --- */
type ProjectDetailsContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = ProjectDetailsContainerState;
type ContainerActions = ProjectDetailsContainerActions;

export { RootState, ContainerState, ContainerActions };
