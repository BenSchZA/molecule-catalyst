/**
 *
 * TransactionModalContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import ProjectRedeemModal from 'components/ProjectRedeemModal';
import ProjectSupportModal from 'components/ProjectSupportModal';
import selectTransactionModalContainer from './selectors';
import { supportProject, withdrawHoldings, withdrawRedistribution } from 'domain/projects/actions';

interface OwnProps {
  projectId: string,
  userAddress: string,
  modalState: boolean,
  mode: 'support' | 'redeem',
  handleClose(): void,
}

interface DispatchProps {
  supportProject(projectId: string, contribution: number): void,
  withdrawHoldings(projectId: string, tokenAmount: number): void,
  withdrawRedistribution(projectId: string, tokenAmount: number): void,
}

export interface StateProps {
  tokenBalance: number,
  contributionValue: number,
  marketAddress: string,
  marketActive: boolean,
  txInProgress: boolean,
  daiBalance: number,
  researchContributionRate: number,
  maxResearchContribution: number,
}

type Props = StateProps & DispatchProps & OwnProps;

const TransactionModalContainer: React.FunctionComponent<Props> = ({
  modalState,
  handleClose,
  tokenBalance,
  contributionValue,
  marketAddress,
  marketActive,
  txInProgress,
  withdrawHoldings,
  withdrawRedistribution,
  daiBalance,
  supportProject,
  projectId,
  mode,
  researchContributionRate,
  maxResearchContribution
}) => {
  const handleSupportProject = (contributionAmount: number) => supportProject(projectId, contributionAmount);
  const handleRedeemContribution = (tokenAmount: number) => marketActive ? withdrawHoldings(projectId, tokenAmount) : withdrawRedistribution(projectId, tokenAmount);

  return (mode === 'redeem') ?
      <ProjectRedeemModal
        closeModal={handleClose}
        modalState={modalState}
        tokenBalance={tokenBalance}
        contributionValue={contributionValue}
        txInProgress={txInProgress}
        redeemHoldings={handleRedeemContribution}
        marketAddress={marketAddress}
        marketActive={marketActive} /> :
      <ProjectSupportModal
        closeModal={handleClose}
        modalState={modalState}
        daiBalance={daiBalance}
        contributionRate={researchContributionRate}
        txInProgress={txInProgress}
        supportProject={handleSupportProject}
        marketAddress={marketAddress}
        maxResearchContribution={maxResearchContribution} />
    }

const mapStateToProps = (state, props: OwnProps) => selectTransactionModalContainer(state, props.projectId, props.userAddress);

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    supportProject: (projectId: string, contribution: number) => dispatch(supportProject.request({ projectId: projectId, contribution: contribution })),
    withdrawHoldings: (projectId: string, tokenAmount: number) => dispatch(withdrawHoldings.request({ projectId: projectId, tokenAmount: tokenAmount })),
    withdrawRedistribution: (projectId: string, tokenAmount: number) => dispatch(withdrawRedistribution.request({ projectId: projectId, tokenAmount: tokenAmount })),
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
const withReducer = injectReducer<OwnProps>({
  key: 'transactionModalContainer',
  reducer: reducer,
});
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with saga hoc
const withSaga = injectSaga<OwnProps>({
  key: 'transactionModalContainer',
  saga: saga,
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TransactionModalContainer);
