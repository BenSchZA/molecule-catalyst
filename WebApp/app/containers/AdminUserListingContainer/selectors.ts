import { createSelector, createStructuredSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';
import { ApplicationRootState } from 'types';

const selectCreatorsAwaitingApproval = (state: ApplicationRootState) => {
  return state.adminDashboard.creatorsAwaitingApproval;
};

const selectAllUsers = (state: ApplicationRootState) => {
  return state.adminDashboard.users;
};

const makeSelectCreatorsAwaitingApproval = createSelector(selectCreatorsAwaitingApproval, substate => {
  return (substate) ? Object.values(substate) : [];
})

const makeSelectAllUsers = createSelector(selectAllUsers, substate => {
  return (substate) ? Object.values(substate) : [];
})

const selectAdminUserListing = createStructuredSelector<RootState, StateProps>({
  creatorsAwaitingApproval: makeSelectCreatorsAwaitingApproval,
  users: makeSelectAllUsers
});



export default selectAdminUserListing;
