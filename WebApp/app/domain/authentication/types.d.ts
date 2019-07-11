import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface AuthenticationState {
  readonly refreshToken: string;
  readonly accessToken: string;
  readonly userId: string;
}

/* --- ACTIONS --- */
type AuthenticationActions = ActionType<typeof actions>;

/* --- EXPORTS --- */
type RootState = ApplicationRootState;
type DomainState = AuthenticationState;
type DomainActions = AuthenticationActions;

export { RootState, DomainState, DomainActions };
