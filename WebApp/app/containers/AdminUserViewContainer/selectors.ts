import { createSelector, createStructuredSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from 'containers/DiscoverContainer';
import { ApplicationRootState } from 'types';

const selectUser = (state: ApplicationRootState, props) => {
  return state.adminDashboard.users;
};

const makeSelectUser = createSelector(selectUser, substate => {
  return (substate) ? Object.keys(substate).map(k => substate[k]) : [];
})

const selectAdminViewUser = createStructuredSelector<RootState, StateProps>({
  user: makeSelectUser,
});

export default selectAdminViewUser;
