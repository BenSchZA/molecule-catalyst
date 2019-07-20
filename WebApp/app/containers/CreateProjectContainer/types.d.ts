import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface CreateProjectContainerState {
  readonly default: any;
}

/* --- ACTIONS --- */
type CreateProjectContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = CreateProjectContainerState;
type ContainerActions = CreateProjectContainerActions;

export { RootState, ContainerState, ContainerActions };
