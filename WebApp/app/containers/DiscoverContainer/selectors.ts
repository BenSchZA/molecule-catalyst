import { createStructuredSelector, createSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';
import { selectAllProjects } from 'domain/projects/selectors';
import { ApplicationRootState } from 'types';
import { ProjectSubmissionStatus } from 'domain/projects/types';

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
    const allDashboardProjects = allProjects.filter(p => p.status === ProjectSubmissionStatus.started || p.status === ProjectSubmissionStatus.ended);
    if (!filter.text && filter.projectStatus === -1) {
      return allDashboardProjects
    } else {
      let filteredProjects = allDashboardProjects.filter(p => p.title.toLowerCase().includes(filter.text.toLowerCase()) || p.user.fullName && p.user.fullName.toLowerCase().includes(filter.text.toLowerCase()))
      if (filter.projectStatus !== -1) {
        filteredProjects = filteredProjects.filter(p => p.status === filter.projectStatus);
      }
      return filteredProjects;
    }

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
