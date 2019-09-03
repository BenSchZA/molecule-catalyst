import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface AdminUserListingContainerState {
  users: any[],
  creatorsAwaitingApproval: any[],
}

/* --- ACTIONS --- */
type AdminUserListingContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = AdminUserListingContainerState;
type ContainerActions = AdminUserListingContainerActions;

export { RootState, ContainerState, ContainerActions };
