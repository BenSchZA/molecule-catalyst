/**
 *
 * ProjectDetailsContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import { RouteComponentProps } from 'react-router-dom';

interface RouteParams {
  projectId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
React.Props<RouteParams> { }

interface DispatchProps {}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

const ProjectDetailsContainer: React.FunctionComponent<Props> = (props: Props) => {
  return <Fragment>ProjectDetailsContainer</Fragment>;
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
