/**
 *
 * AdminProjectReviewContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { Container } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import AdminProjectReview from 'components/AdminProjectReview';
import * as actions from './actions';


interface RouteParams {
  projectId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
React.Props<RouteParams> { }

interface DispatchProps {
  approveProject(): void
  rejectProject(): void
}

interface StateProps {
  project: any
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminProjectReviewContainer: React.SFC<Props> = (props: Props) => (
  <Container maxWidth='xl'>
    <AdminProjectReview {...props}/>
  </Container>
);

const mapStateToProps = (state, props) => ({
  project: state.adminProjectListing.projects[props.match.params.projectId],
})

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  approveProject: () => dispatch(actions.approveProject(ownProps.match.params.projectId)),
  rejectProject: () => dispatch(actions.rejectProject(ownProps.match.params.projectId)),
})


const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
)(AdminProjectReviewContainer);
