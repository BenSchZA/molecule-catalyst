import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface DiscoverContainerState {
  filter: {
    text: string,
    projectStatus: number,
  }
}

/* --- ACTIONS --- */
type DiscoverContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = DiscoverContainerState;
type ContainerActions = DiscoverContainerActions;

export { RootState, ContainerState, ContainerActions };
