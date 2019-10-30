import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface AdminProjectEditContainerState {
  readonly default: any;
}

/* --- ACTIONS --- */
type AdminProjectEditContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = AdminProjectEditContainerState;
type ContainerActions = AdminProjectEditContainerActions;

export { RootState, ContainerState, ContainerActions };
