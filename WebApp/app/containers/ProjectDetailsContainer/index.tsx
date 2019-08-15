/**
 *
 * ProjectDetailsContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import { RouteComponentProps } from 'react-router-dom';
import ProjectDetails from 'components/ProjectDetails';
import { Project } from 'domain/projects/types';

interface RouteParams {
  projectId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
React.Props<RouteParams> { }

interface DispatchProps {}

interface StateProps {
  project: Project
}

type Props = StateProps & DispatchProps & OwnProps;

const ProjectDetailsContainer: React.FunctionComponent<Props> = (props: Props) => {
  return <ProjectDetails project={props.project} />;
};

const mapStateToProps = (state, props) => ({
  project: state.projects[props.match.params.projectId],
})

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    dispatch: dispatch,
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga<OwnProps>({
  key: 'projectDetailsContainer',
  saga: saga,
});

export default compose(
  withSaga,
  withConnect,
)(ProjectDetailsContainer);
