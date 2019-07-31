/**
 *
 * AdminDashboardContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import selectAdminDashboard from './selectors';

interface OwnProps {}

interface DispatchProps {}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

const AdminDashboardContainer: React.SFC<Props> = (props: Props) => {
  return <Fragment>AdminDashboardContainer</Fragment>;
};

const mapStateToProps = (state) => selectAdminDashboard(state);

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    dispatch: dispatch,
  };
};

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
