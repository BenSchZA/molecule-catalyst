import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface TransactionModalContainerState {
  readonly txInProgress: boolean,
}

/* --- ACTIONS --- */
type TransactionModalContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = TransactionModalContainerState;
type ContainerActions = TransactionModalContainerActions;

export { RootState, ContainerState, ContainerActions };
