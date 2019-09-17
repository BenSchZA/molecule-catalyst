/**
 *
 * MyProjectsContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import selectMyProjects from './selectors';
import saga from './saga';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import { Project } from 'domain/projects/types';
import { Container } from '@material-ui/core';
import { launchProject, withdrawFunding } from 'domain/projects/actions';
import MyProjectsListing from 'components/MyProjectsListing';

interface OwnProps {}

interface DispatchProps {
  launchProject(projectId: string): void;
  withdrawFunding(projectId: string): void;
}

export interface StateProps {
  myProjects: Array<Project>,
}

type Props = StateProps & DispatchProps & OwnProps;

const MyProjectsContainer: React.FunctionComponent<Props> = (props: Props) => (
  <Container maxWidth='xl'>
    <MyProjectsListing {...props}/>
  </Container>
);

const mapStateToProps = (state) => selectMyProjects(state);

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    launchProject: (projectId: string) => dispatch(launchProject.request(projectId)),
    withdrawFunding: (projectId: string) => dispatch(withdrawFunding.request(projectId)),
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// <OwnProps> restricts access to the HOC's other props. This component must not do anything with saga hoc
const withSaga = injectSaga<OwnProps>({
  key: 'myProjectsContainer',
  saga: saga,
  mode: RESTART_ON_REMOUNT,
});

export default compose(
  withSaga,
  withConnect,
)(MyProjectsContainer);
