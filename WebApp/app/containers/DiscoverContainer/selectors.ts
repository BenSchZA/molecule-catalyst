import { createStructuredSelector } from 'reselect';
import { makeSelectIsLoggedIn, makeSelectWalletUnlocked } from 'domain/authentication/selectors';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';

/**
 * Direct selector to the dashboardContainer state domain
 */

/**
 * Other specific selectors
 */

/**
 * Default selector used by DashboardContainer
 */

const selectDashboardContainer = createStructuredSelector<RootState, StateProps>({
  isLoggedIn: makeSelectIsLoggedIn,
  walletUnlocked: makeSelectWalletUnlocked,
});

export default selectDashboardContainer;
