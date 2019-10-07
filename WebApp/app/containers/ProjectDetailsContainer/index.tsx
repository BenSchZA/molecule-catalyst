/**
 *
 * ProjectDetailsContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import injectSaga from 'utils/injectSaga';
import saga from './saga';
import ProjectDetails from 'components/ProjectDetails';
import { Project } from 'domain/projects/types';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import { ApplicationRootState } from 'types';

interface RouteParams {
  projectId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
  React.Props<RouteParams> { }

interface DispatchProps {
}

interface StateProps {
  project: Project,
  userAddress: string,
}

type Props = StateProps & DispatchProps & OwnProps;

const ProjectDetailsContainer: React.FunctionComponent<Props> = ({ project, userAddress }: Props) => {
  return (
    <ProjectDetails
      project={project}
      userAddress={userAddress}
    />
  );
};

const mapStateToProps = (state: ApplicationRootState, props) => ({
  project: state.projects[props.match.params.projectId],
  daiBalance: state.authentication.daiBalance,
  userAddress: state.authentication.ethAddress,
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  dispatch: dispatch
});

const withReducer = injectReducer<OwnProps>({
  key: 'projectDetailsContainer',
  reducer: reducer,
});

const withSaga = injectSaga<OwnProps>({
  key: 'projectDetailsContainer',
  saga: saga,
  mode: RESTART_ON_REMOUNT
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);


export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ProjectDetailsContainer);
