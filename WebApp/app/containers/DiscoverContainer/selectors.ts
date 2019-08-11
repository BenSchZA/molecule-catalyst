import { createStructuredSelector, createSelector } from 'reselect';
import { makeSelectIsLoggedIn, makeSelectWalletUnlocked } from 'domain/authentication/selectors';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';
import { selectAllProjects } from 'domain/projects/selectors';
import { ApplicationRootState } from 'types';

/**
 * Direct selector to the dashboardContainer state domain
 */

const selectFilter = (state: ApplicationRootState) => {
  return state ? state.discover.filter : {};
};

const makeSelectFilter = createSelector(
  selectFilter,
  (filter) => {
    return filter;
  },
);

 const makeSelectDiscoverProjects = createSelector(
  selectAllProjects,
  makeSelectFilter,
  (allProjects, filter) => {
    return allProjects;
  },
);

/**
 * Default selector used by DashboardContainer
 */

const selectDiscoverContainer = createStructuredSelector<RootState, StateProps>({
  isLoggedIn: makeSelectIsLoggedIn,
  walletUnlocked: makeSelectWalletUnlocked,
  projects: makeSelectDiscoverProjects
});

export default selectDiscoverContainer;
