import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface BecomeCreatorContainerState {
  readonly default: any;
}

/* --- ACTIONS --- */
type BecomeCreatorContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = BecomeCreatorContainerState;
type ContainerActions = BecomeCreatorContainerActions;

export { RootState, ContainerState, ContainerActions };
