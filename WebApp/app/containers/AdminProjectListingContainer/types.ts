// import { ActionType } from 'typesafe-actions';
// import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface AdminProjectListingContainerState {
}

/* --- ACTIONS --- */
// type AdminProjectListingContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = AdminProjectListingContainerState;
// type ContainerActions = AdminProjectListingContainerActions;

export { RootState, ContainerState };
