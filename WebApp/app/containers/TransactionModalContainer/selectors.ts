import { createStructuredSelector, createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { RootState } from 'containers/TransactionModalContainer/types';
import { StateProps } from './index';
import { selectProject } from 'domain/projects/selectors';
import { Project } from 'domain/projects/types';
import { ethers } from 'ethers';

const selectTokenBalance = (projectId: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => Number(project?.chainData?.marketData?.balance) || 0
  )

const selectHoldingsValue = (projectId: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => Number(project?.chainData?.marketData?.holdingsValue) || 0
  )

const selectContributionValue = (projectId: string, userAddress: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => {
      console.log(project);
      console.log(project?.marketData?.netCost);
      return Number(ethers.utils.formatEther(
        ethers.utils.bigNumberify(project?.marketData?.netCost?.[userAddress])
        .mul(project?.marketData?.balances?.[userAddress]))) || 0
      }
  )

const selectMarketAddress = (projectId: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => project.chainData.marketAddress
  )

const selectDaiBalance = () =>
  createSelector(
    (state: ApplicationRootState) => state.authentication,
    (authData) => authData.daiBalance,
  )

const selectTaxationRate = (projectId: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => project.chainData.marketData.taxationRate,
  )

const selectMaxResearchContribution = (projectId: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => Number(ethers.utils.formatEther(
      project.vaultData.phases.reduce((total, phase) => total.add(phase.fundingThreshold), ethers.utils.bigNumberify(0))
      .sub(project.vaultData.totalRaised))),
  )

const selectTxInProgress = () => 
  createSelector(
    (state: ApplicationRootState) => state.transactionModalContainer,
    containerState => containerState.txInProgress,
  )
const selectTransactionModalContainer = (
  state: ApplicationRootState,
  projectId: string,
  userAddress: string) => {
  return createStructuredSelector<RootState, StateProps>({
    tokenBalance: selectTokenBalance(projectId),
    holdingsValue: selectHoldingsValue(projectId),
    contributionValue: selectContributionValue(projectId, userAddress),
    marketAddress: selectMarketAddress(projectId),
    txInProgress: selectTxInProgress(),
    daiBalance: selectDaiBalance(),
    taxationRate: selectTaxationRate(projectId),
    maxResearchContribution: selectMaxResearchContribution(projectId),
  })
};

export default selectTransactionModalContainer;