import { createStructuredSelector, createSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';
import { selectAllProjects } from 'domain/projects/selectors';
import { ApplicationRootState } from 'types';

/**
 * Direct selector to the dashboardContainer state domain
 */

const selectFilter = (state: ApplicationRootState) => {
  return state ? state.discover.filter : {
    text: '',
    projectStatus: -1,
  };
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
  projects: makeSelectDiscoverProjects,
  filter: makeSelectFilter,
});

export default selectDiscoverContainer;
