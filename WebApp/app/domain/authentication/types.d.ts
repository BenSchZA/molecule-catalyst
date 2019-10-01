import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';
import { UserType } from 'containers/App/routes';

/* --- STATE --- */
interface AuthenticationState {
  approvedNetwork: boolean,
  walletUnlocked: boolean,
  accessToken: string,
  ethAddress: string,
  daiBalance: number,
  signedPermit: string,
  networkId: number,
  errorMessage: string,
  userRole: number,
  userId: string,
}

/* --- ACTIONS --- */
type AuthenticationActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type DomainState = AuthenticationState;
type DomainActions = AuthenticationActions;

export { RootState, DomainState, DomainActions };
