/**
 *
 * ProjectDetailsContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import ProjectDetails from 'components/ProjectDetails';
import { Project } from 'domain/projects/types';
import { ApplicationRootState } from 'types';
import { makeSelectIsLoggedIn } from 'domain/authentication/selectors';
import injectSaga from 'utils/injectSaga';
import saga from './saga';
import { RESTART_ON_REMOUNT, DAEMON } from 'utils/constants';
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
  isLoggedIn: boolean,
}

type Props = StateProps & DispatchProps & OwnProps;

const ProjectDetailsContainer: React.FunctionComponent<Props> = ({ project, userAddress, isLoggedIn }: Props) => {
  
  return (
    <ProjectDetails
      project={project}
      userAddress={userAddress}
      isLoggedIn={isLoggedIn}
    />
  );
};

const mapStateToProps = (state: ApplicationRootState, props) => ({
  project: state.projects[props.match.params.projectId],
  daiBalance: state.authentication.daiBalance,
  userAddress: state.authentication.ethAddress,
  isLoggedIn: makeSelectIsLoggedIn(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
});


const withSaga = injectSaga<OwnProps>({
  key: 'projectDetailsContainer',
  saga: saga,
  mode: DAEMON
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);


export default compose(
  withSaga,
  withConnect,
)(ProjectDetailsContainer);
