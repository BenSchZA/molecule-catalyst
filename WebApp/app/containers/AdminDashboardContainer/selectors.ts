import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

/**
 * Direct selector to the adminDashboardContainer state domain
 */

const selectAdminDashboardContainerDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminDashboardContainer
 */

const selectAdminDashboardContainer = () =>
  createSelector(
    selectAdminDashboardContainerDomain,
    substate => {
      return substate;
    },
  );

export default selectAdminDashboardContainer;
export { selectAdminDashboardContainerDomain };
