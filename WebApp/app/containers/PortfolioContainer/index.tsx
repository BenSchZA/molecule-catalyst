/**
 *
 * PortfolioContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { ApplicationRootState } from 'types';
import BackedProjectsGrid from 'components/BackedProjectsGrid';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import { Project } from 'domain/projects/types';
import { withdrawHoldings } from 'domain/projects/actions';

interface OwnProps {}

interface DispatchProps {
}

export interface StateProps {
  projects: Array<Project>,
  userAddress: string,
  txInProgress: boolean,
  withdrawHoldings(projectId: string): void,
}

type Props = StateProps  & OwnProps & DispatchProps;

const PortfolioContainer: React.FunctionComponent<Props> = ({userAddress, projects}: Props) => (
  <Fragment>
    <BackedProjectsGrid projects={projects} userAddress={userAddress}/>
  </Fragment>
)

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  withdrawHoldings: (projectId) => dispatch(withdrawHoldings.request(projectId)),
});

const mapStateToProps = (state: ApplicationRootState) => ({
  projects: state.projects,
  userAddress: state.authentication.ethAddress,
  txInProgress: state.portfolioContainer.txInProgress
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer<OwnProps>({
  key: 'portfolioContainer',
  reducer: reducer,
});
const withSaga = injectSaga<OwnProps>({
  key: 'portfolioContainer',
  saga: saga,
  mode: RESTART_ON_REMOUNT
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(PortfolioContainer);
