/**
 *
 * AdminProjectApprovalListingContainer
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
import selectAdminProjectListing from './selectors';
import { Container } from '@material-ui/core';
import AdminProjectListing from 'components/AdminProjectListing';


interface OwnProps { }

interface DispatchProps {

}

export interface StateProps {
  projects: Array<any>,
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminProjectApprovalListingContainer: React.SFC<Props> = (props: Props) => (
  <Container maxWidth='xl'>
    <AdminProjectListing projects={props.projects}></AdminProjectListing>
  </Container>
);

const mapStateToProps = (state) => selectAdminProjectListing(state);

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
  key: 'adminProjectListing',
  reducer: reducer,
});
const withSaga = injectSaga<OwnProps>({
  key: 'adminProjectListing',
  saga: saga,
  mode: RESTART_ON_REMOUNT
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AdminProjectApprovalListingContainer);
