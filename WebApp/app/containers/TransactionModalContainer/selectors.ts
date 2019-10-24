import { createStructuredSelector, createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { RootState } from 'containers/TransactionModalContainer/types';
import { StateProps } from './index';
import { selectProject } from 'domain/projects/selectors';
import { Project } from 'domain/projects/types';
import { ethers } from 'ethers';

const truncate = (value, decimals) => Math.trunc(Math.pow(10, decimals) * value) / Math.pow(10, decimals);

const selectTokenBalance = (projectId: string, userAddress: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => {
      return truncate(Number(ethers.utils.formatEther(project?.marketData?.balances?.[userAddress] || 0)), 15)
    })

const selectContributionValue = (projectId: string, userAddress: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => {
      return (project?.marketData?.netCost?.[userAddress] && project?.marketData?.balances?.[userAddress]) ?
        Number(ethers.utils.formatEther(project?.marketData?.netCost?.[userAddress]))
        * Number(ethers.utils.formatEther(project?.marketData?.balances?.[userAddress])) : 0
    }
  )

const selectMarketAddress = (projectId: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => project.chainData.marketAddress
  )

const selectMarketActive = (projectId: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => project.marketData.active
  )

const selectDaiBalance = () =>
  createSelector(
    (state: ApplicationRootState) => state.authentication,
    (authData) => authData.daiBalance,
  )

const selectTaxationRate = (projectId: string) =>
  createSelector(
    selectProject(projectId),
    (project: Project) => project.marketData.taxationRate,
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
    tokenBalance: selectTokenBalance(projectId, userAddress),
    contributionValue: selectContributionValue(projectId, userAddress),
    marketAddress: selectMarketAddress(projectId),
    marketActive: selectMarketActive(projectId),
    txInProgress: selectTxInProgress(),
    daiBalance: selectDaiBalance(),
    taxationRate: selectTaxationRate(projectId),
    maxResearchContribution: selectMaxResearchContribution(projectId),
  })
};

export default selectTransactionModalContainer;