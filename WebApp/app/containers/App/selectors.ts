
import { createStructuredSelector } from 'reselect';
import { RootState } from './types';
import { StateProps } from 'containers/App';
import { 
  makeSelectIsLoggedIn, 
  makeSelectWalletUnlocked, 
  makeSelectEthAddress, 
  makeSelectDaiBalance,
  makeSelectUserRole,
  makeSelectApprovedNetwork,
  makeSelectApprovedNetworkName,
  makeSelectUserId,
} from 'domain/authentication/selectors';

/**
 * Direct selector to the user state domain
 */


/**
 * Other specific selectors
 */


/**
 * Default selector used by App
 */

// Root
const selectApp = createStructuredSelector<RootState, StateProps>({
  isLoggedIn: makeSelectIsLoggedIn,
  walletUnlocked: makeSelectWalletUnlocked,
  ethAddress: makeSelectEthAddress,
  userId: makeSelectUserId,
  daiBalance: makeSelectDaiBalance,
  userRole: makeSelectUserRole, 
  approvedNetwork: makeSelectApprovedNetwork,
  approvedNetworkName: makeSelectApprovedNetworkName,
});

export default selectApp;
