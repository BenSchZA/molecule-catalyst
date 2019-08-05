/**
 *
 * AdminUserViewContainer
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
import selectAdminViewUser from './selectors';
import { Container } from '@material-ui/core';


interface OwnProps { }

interface DispatchProps {
}

interface StateProps {
  user: {},
  creator: {},
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminUserViewContainer: React.SFC<Props> = (props: Props) => (
  <Container maxWidth='xl'>
  </Container>
);

const mapStateToProps = (state) => selectAdminViewUser(state);

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
});


const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer<OwnProps>({
  key: 'adminUserView',
  reducer: reducer,
});
const withSaga = injectSaga<OwnProps>({
  key: 'adminUserView',
  saga: saga,
  mode: RESTART_ON_REMOUNT
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AdminUserViewContainer);
