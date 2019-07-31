import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface AdminDashboardContainerState {
  creatorsAwaitingApproval: any,
}

/* --- ACTIONS --- */
type AdminDashboardContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = AdminDashboardContainerState;
type ContainerActions = AdminDashboardContainerActions;

export { RootState, ContainerState, ContainerActions };
