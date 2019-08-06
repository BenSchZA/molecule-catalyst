import { createSelector, createStructuredSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from 'containers/DiscoverContainer';
import { ApplicationRootState } from 'types';

const selectProjectsAwaitingApproval = (state: ApplicationRootState) => {
  return state.adminProjectListing.projectsAwaitingApproval;
};

const makeSelectProjectsAwaitingApproval = createSelector(selectProjectsAwaitingApproval, substate => {
  return (substate) ? Object.keys(substate).map(k => substate[k]) : [];
})

const selectAdminProjectListing = createStructuredSelector<RootState, StateProps>({
  projectsWaitingApproval: makeSelectProjectsAwaitingApproval
});



export default selectAdminProjectListing;
