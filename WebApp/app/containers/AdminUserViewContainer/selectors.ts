import { createSelector, createStructuredSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from 'containers/DiscoverContainer';
import { ApplicationRootState } from 'types';

const selectUser = (state: ApplicationRootState) => {
  return state.adminUserView.user;
};

const selectCreator = (state: ApplicationRootState) => {
  return state.adminUserView.creator;
};

const makeSelectUser = createSelector(selectUser, substate => {
  return (substate) ? Object.keys(substate).map(k => substate[k]) : [];
})

const makeSelectCreator = createSelector(selectCreator, substate => {
  return (substate) ? Object.keys(substate).map(k => substate[k]) : [];
})

const selectAdminViewUser = createStructuredSelector<RootState, StateProps>({
  user: makeSelectUser,
  creator: makeSelectCreator
});

export default selectAdminViewUser;
