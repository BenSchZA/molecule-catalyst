/**
 *
 * AdminUserViewContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Container } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import UserDetailsView from 'components/UserDetailsView';

interface RouteParams {
  userId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
React.Props<RouteParams> { }

interface DispatchProps {
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
    <UserDetailsView user={props.user}/>
  </Container>
);

const mapStateToProps = (state, props) => ({
  user: state.adminDashboard.users[props.match.params.userId],
})

const withConnect = connect(
  mapStateToProps,
);

export default compose(
  withConnect,
)(AdminUserViewContainer);
