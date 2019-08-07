import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface AdminProjectApprovalListingContainerState {
  projects: any,
}

/* --- ACTIONS --- */
type AdminProjectApprovalListingContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = AdminProjectApprovalListingContainerState;
type ContainerActions = AdminProjectApprovalListingContainerActions;

export { RootState, ContainerState, ContainerActions };
