import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface AdminProjectReviewState {
  readonly txInProgress: boolean;
}

/* --- ACTIONS --- */
type MyProjectsContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = AdminProjectReviewState;
type ContainerActions = MyProjectsContainerActions;

export { RootState, ContainerState, ContainerActions };
