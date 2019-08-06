/**
 *
 * AdminProjectReviewContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Container } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import AdminProjectReview from 'components/AdminProjectReview';

interface RouteParams {
  projectId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
React.Props<RouteParams> { }

interface DispatchProps {
}

interface StateProps {
  project: any
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminProjectReviewContainer: React.SFC<Props> = (props: Props) => (
  <Container maxWidth='xl'>
    <AdminProjectReview project={props.project}/>
  </Container>
);

const mapStateToProps = (state, props) => ({
  user: state.adminProjectListing.projects[props.match.params.projectId],
})

const withConnect = connect(
  mapStateToProps,
);

export default compose(
  withConnect,
)(AdminProjectReviewContainer);
