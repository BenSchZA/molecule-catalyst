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
import { supportProject, withdrawHoldings } from 'domain/projects/actions';

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
}

export interface StateProps {
  tokenBalance: number,
  holdingsValue: number,
  contributionValue: number,
  marketAddress: string,
  txInProgress: boolean,
  daiBalance: number,
  taxationRate: number,
  maxResearchContribution: number,
}

type Props = StateProps & DispatchProps & OwnProps;

const TransactionModalContainer: React.FunctionComponent<Props> = ({
  modalState,
  handleClose,
  tokenBalance,
  holdingsValue,
  contributionValue,
  marketAddress,
  txInProgress,
  withdrawHoldings,
  daiBalance,
  supportProject,
  projectId,
  mode,
  taxationRate,
  maxResearchContribution
}) => {
  const handleSupportProject = (contributionAmount: number) => supportProject(projectId, contributionAmount);
  const handleRedeemContribution = (tokenAmount: number) => withdrawHoldings(projectId, tokenAmount);

  return (mode === 'redeem') ?
      <ProjectRedeemModal
        closeModal={handleClose}
        modalState={modalState}
        tokenBalance={tokenBalance}
        holdingsValue={holdingsValue}
        contributionValue={contributionValue}
        txInProgress={txInProgress}
        redeemHoldings={handleRedeemContribution}
        marketAddress={marketAddress} /> :
      <ProjectSupportModal
        closeModal={handleClose}
        modalState={modalState}
        daiBalance={daiBalance}
        contributionRate={taxationRate}
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
    withdrawHoldings: (projectId: string, tokenAmount: number) => dispatch(withdrawHoldings.request({ projectId: projectId, tokenAmount: tokenAmount }))
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
