/**
 *
 * AdminDashboardContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import selectAdminDashboard from './selectors';
import { Container } from '@material-ui/core';
import * as actions from './actions';
import CreatorsAwaitingReview from 'components/CreatorsAwaitingReview';
import UserManagement from 'components/UserManagement';


interface OwnProps { }

interface DispatchProps {
  approveCreatorApplication(applicationId: string): void,
  rejectCreatorApplication(applicationId: string): void,
}

interface StateProps {
  creatorsAwaitingApproval: [],
  users: []
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminDashboardContainer: React.SFC<Props> = (props: Props) => (
  <Container maxWidth='xl'>
    <UserManagement users={props.users} />
    <CreatorsAwaitingReview 
      rejectCreatorApplication={props.rejectCreatorApplication} 
      approveCreatorApplication={props.approveCreatorApplication} 
      creatorApplications={props.creatorsAwaitingApproval} />
  </Container>
);

const mapStateToProps = (state) => selectAdminDashboard(state);

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  approveCreatorApplication: (applicationId: string) => dispatch(actions.approveCreatorApplication(applicationId)),
  rejectCreatorApplication: (applicationId: string) => dispatch(actions.rejectCreatorApplication(applicationId)),
});


const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer<OwnProps>({
  key: 'adminDashboard',
  reducer: reducer,
});
const withSaga = injectSaga<OwnProps>({
  key: 'adminDashboard',
  saga: saga,
  mode: RESTART_ON_REMOUNT
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AdminDashboardContainer);
