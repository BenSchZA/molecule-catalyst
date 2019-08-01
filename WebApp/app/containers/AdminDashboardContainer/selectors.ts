import { createSelector, createStructuredSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from 'containers/DiscoverContainer';
import { ApplicationRootState } from 'types';

const selectCreatorsAwaitingApproval = (state: ApplicationRootState) => {
  return state.adminDashboard.creatorsAwaitingApproval;
};

const selectAllUsers = (state: ApplicationRootState) => {
  return state.adminDashboard.allUsers;
};

const makeSelectCreatorsAwaitingApproval = createSelector(selectCreatorsAwaitingApproval, substate => {
  return (substate) ? Object.keys(substate).map(k => substate[k]) : [];
})

const makeSelectAllUsers = createSelector(selectAllUsers, substate => {
  return (substate) ? Object.keys(substate).map(k => substate[k]) : [];
})

const selectAdminDashboard = createStructuredSelector<RootState, StateProps>({
  creatorsAwaitingApproval: makeSelectCreatorsAwaitingApproval,
  allUsers: makeSelectAllUsers
});



export default selectAdminDashboard;
