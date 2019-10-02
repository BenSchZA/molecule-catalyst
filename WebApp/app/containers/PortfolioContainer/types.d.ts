import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface PortfolioContainerState {
  readonly txInProgress: boolean;
}

/* --- ACTIONS --- */
type PortfolioContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = PortfolioContainerState;
type ContainerActions = PortfolioContainerActions;

export { RootState, ContainerState, ContainerActions };
