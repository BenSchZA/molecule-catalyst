/**
 *
 * AdminUserViewContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { Container } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import saga from './saga';
import UserDetailsView from 'components/UserDetailsView';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

interface RouteParams {
  userId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
React.Props<RouteParams> { }

interface DispatchProps {
  promoteToAdmin(): void
}

interface StateProps {
  user: {
    id: string,
    type: number,
    ethAddress: string,
    createdAt: Date,
    fullName?: string,
    email?: string,
    affiliatedOrganisation?: string,
    biography?: string,
    professionalTitle?: string,
    profileImage?: any
  }
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminUserViewContainer: React.SFC<Props> = (props: Props) => (
  <Container maxWidth='xl'>
    <UserDetailsView user={props.user} promoteToAdmin={props.promoteToAdmin}/>
  </Container>
);

const mapStateToProps = (state: ApplicationRootState, props: OwnProps) => ({
  user: state.adminDashboard.users[props.match.params.userId],
})

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  promoteToAdmin: () => dispatch(actions.promoteToAdmin(ownProps.match.params.userId)),
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga<OwnProps>({
  key: 'adminUserViewContainer',
  saga: saga,
});

export default compose(
  withSaga,
  withConnect,
)(AdminUserViewContainer);
