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
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import { Project } from 'domain/projects/types';
import { launchProject } from 'domain/projects/actions';
import { ApplicationRootState } from 'types';

interface RouteParams {
  projectId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
  React.Props<RouteParams> { }

interface DispatchProps {
  launchProject(researchContributionRate: number): void
  rejectProject(): void
}

export interface StateProps {
  project: Project
  txInProgress: boolean
}

type Props = StateProps & DispatchProps & OwnProps;

const AdminProjectReviewContainer: React.FunctionComponent<Props> = (props: Props) => (
  <Container maxWidth='xl'>
    <AdminProjectReview {...props} />
  </Container>
);

const mapStateToProps = (state: ApplicationRootState, props: OwnProps) => ({
  project: state.projects[props.match.params.projectId],
  txInProgress: state.adminProjectReviewContainer.txInProgress,
})

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  launchProject: (researchContributionRate) => dispatch(
    launchProject.request({
      projectId: ownProps.match.params.projectId,
      researchContributionRate: researchContributionRate
    })),

  rejectProject: () => dispatch(actions.rejectProject(ownProps.match.params.projectId)),
})


const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer<OwnProps>({
  key: 'adminProjectReviewContainer',
  reducer: reducer,
});

const withSaga = injectSaga<OwnProps>({
  key: 'adminProjectReviewContainer',
  saga: saga,
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AdminProjectReviewContainer);
