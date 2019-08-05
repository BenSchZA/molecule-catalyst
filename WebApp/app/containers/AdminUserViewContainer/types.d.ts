import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface AdminUserViewContainerReducerState {
  user: any,
  creator: any
}

/* --- ACTIONS --- */
type AdminUserViewContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = AdminUserViewContainerState;
type ContainerActions = AdminUserViewContainerActions;

export { RootState, ContainerState, ContainerActions };
