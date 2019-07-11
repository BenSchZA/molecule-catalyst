import { ActionType } from 'typesafe-actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface LoginPageState {
  readonly error: string;
}

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = LoginPageState;

export { RootState, ContainerState };