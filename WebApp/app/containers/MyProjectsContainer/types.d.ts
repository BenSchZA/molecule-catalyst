import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface MyProjectsContainerState {
  readonly txInProgress: boolean;
}

/* --- ACTIONS --- */
type MyProjectsContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = MyProjectsContainerState;
type ContainerActions = MyProjectsContainerActions;

export { RootState, ContainerState, ContainerActions };
