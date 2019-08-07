import { createSelector, createStructuredSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from './';
import { ApplicationRootState } from 'types';

const selectProjects = (state: ApplicationRootState) => {
  return state.adminProjectListing.projects;
};

const makeSelectProjects = createSelector(selectProjects, substate => {
  return (substate) ? Object.keys(substate).map(k => substate[k]) : [];
})

const selectAdminProjectListing = createStructuredSelector<RootState, StateProps>({
  projects: makeSelectProjects
});



export default selectAdminProjectListing;
