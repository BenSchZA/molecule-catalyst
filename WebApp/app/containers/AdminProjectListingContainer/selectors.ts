import { createStructuredSelector, createSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';
import { selectAllProjects } from 'domain/projects/selectors';
import { ApplicationRootState } from 'types';

const selectFilter = (state: ApplicationRootState) => {
  return state ? state.adminProjectListing.statusFilter : -1
};

const makeSelectFilter = createSelector(
  selectFilter,
  (filter) => {
    return filter;
  },
);

const makeSelectFilteredProjects = createSelector(
  selectAllProjects,
  makeSelectFilter,
  (allProjects, filter) => {
    if (filter === -1) {
      return allProjects
    } else {
      return allProjects.filter(p => p.status === filter);
    }

  }
)

const selectAdminProjectListing = createStructuredSelector<RootState, StateProps>({
  projects: makeSelectFilteredProjects,
  statusFilter: makeSelectFilter
});



export default selectAdminProjectListing;
