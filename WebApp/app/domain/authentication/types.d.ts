import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';
import { UserType } from 'containers/App/routes';

/* --- STATE --- */
interface AuthenticationState {
  accessToken: string,
  ethAddress: string,
  signedPermit: string,
  walletUnlocked: boolean,
  selectedNetworkId?: number,
  errorMessage: string,
  userRole: number,
}


/* --- ACTIONS --- */
type AuthenticationActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type DomainState = AuthenticationState;
type DomainActions = AuthenticationActions;

export { RootState, DomainState, DomainActions };
