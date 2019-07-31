import { createSelector, createStructuredSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from 'containers/DiscoverContainer';
import { ApplicationRootState } from 'types';

const selectCreatorsAwaitingApproval = (state: ApplicationRootState) => {
  return state.adminDashboard.creatorsAwaitingApproval;
};

const makeSelectCreatorsAwaitingApproval = createSelector(selectCreatorsAwaitingApproval, substate => {
  return substate;
})

const selectAdminDashboard = createStructuredSelector<RootState, StateProps>({
  creatorsAwaitingApproval: makeSelectCreatorsAwaitingApproval,
});

export default selectAdminDashboard;
