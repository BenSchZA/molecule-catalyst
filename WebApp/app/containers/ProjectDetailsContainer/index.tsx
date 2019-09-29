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
import { supportProject, withdrawHoldings } from 'domain/projects/actions';
import { ethers } from 'ethers';

interface RouteParams {
  projectId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>,
  React.Props<RouteParams> { }

interface DispatchProps {
}

interface StateProps {
  project: Project,
  daiBalance: number,
  userAddress: string,
  contribution: number,
  txInProgress: boolean,
  supportProject(projectId: string, contribution: number): void,
  withdrawHoldings(projectId: string): void,
}

type Props = StateProps & DispatchProps & OwnProps;

const ProjectDetailsContainer: React.FunctionComponent<Props> = (props: Props) => {
  const { project, userAddress } = props;

  const holdingsValue = project && project.chainData && project.chainData.marketData
    ? Number(ethers.utils.formatEther(project.chainData.marketData.holdingsValue)) : 0;

  const contributionValue =
    userAddress &&
      project &&
      project.marketData &&
      project.marketData.netCost &&
      project.marketData.netCost[userAddress]
      ? Number(ethers.utils.formatEther(project.marketData.netCost[userAddress]))
      * Number(ethers.utils.formatEther(project.marketData.balances[userAddress])) : 0;

  const tokenBalance =
    userAddress &&
      project &&
      project.marketData &&
      project.marketData.balances &&
      project.marketData.balances[userAddress]
      ? Number(ethers.utils.formatEther(project.marketData.balances[userAddress])) : 0;

  return (
    <ProjectDetails
      project={props.project}
      daiBalance={props.daiBalance}
      tokenBalance={tokenBalance}
      holdingsValue={holdingsValue}
      contributionValue={contributionValue}
      txInProgress={props.txInProgress}
      supportProject={props.supportProject}
      redeemHoldings={props.withdrawHoldings}
    />
  );
};

const mapStateToProps = (state: ApplicationRootState, props) => ({
  project: state.projects[props.match.params.projectId],
  daiBalance: state.authentication.daiBalance,
  userAddress: state.authentication.ethAddress,
  txInProgress: state.projectDetailsContainer.txInProgress
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  supportProject: (projectId: string, contribution: number) => dispatch(supportProject.request({ projectId: projectId, contribution: contribution })),
  withdrawHoldings: (projectId: string) => dispatch(withdrawHoldings.request(projectId)),
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
