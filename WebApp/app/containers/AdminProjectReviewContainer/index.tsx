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
import injectSaga from 'utils/injectSaga';
import saga from './saga';
import { Project } from 'domain/projects/types';

interface RouteParams {
  projectId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
  React.Props<RouteParams> { }

interface DispatchProps {
  approveProject(researchContributionRate: number): void
  rejectProject(): void
}

export interface StateProps {
  project: Project
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminProjectReviewContainer: React.FunctionComponent<Props> = (props: Props) => (
  <Container maxWidth='xl'>
    <AdminProjectReview {...props} />
  </Container>
);

const mapStateToProps = (state, props) => ({
  project: state.projects[props.match.params.projectId],
})

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  approveProject: (researchContributionRate) => dispatch(
    actions.approveProject({
      projectId: ownProps.match.params.projectId,
      researchContributionRate: researchContributionRate
    })),
  rejectProject: () => dispatch(actions.rejectProject(ownProps.match.params.projectId)),
})


const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withSaga = injectSaga<OwnProps>({
  key: 'adminProjectReviewContainer',
  saga: saga,
});

export default compose(
  withSaga,
  withConnect,
)(AdminProjectReviewContainer);
