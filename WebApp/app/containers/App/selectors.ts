
import { createStructuredSelector } from 'reselect';
import { RootState } from './types';
import { StateProps } from 'containers/App';
import { 
  makeSelectIsLoggedIn, 
  makeSelectWalletUnlocked, 
  makeSelectNetworkName, 
  makeSelectEthAddress, 
  makeSelectDaiBalance,
  makeSelectUserRole,
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
  selectedNetworkName: makeSelectNetworkName,
  ethAddress: makeSelectEthAddress,
  daiBalance: makeSelectDaiBalance,
  userRole: makeSelectUserRole, 
});

export default selectApp;
