import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';
import { BigNumber } from 'ethers/utils';

enum ProjectSubmissionStatus {
  created,
  accepted,
  rejected,
  started,
  ended
}

interface IProject {
  id: string;
  user: User
  title: string,
  createdAt: string,
  abstract: string,
  featuredImage: string,
  context: string,
  approach: string,
  collaborators: Collaborator[],
  researchPhases: ResearchPhase[],
  status: ProjectSubmissionStatus,
  reviewedBy: string,
  chainData: ChainData,
  marketData: MarketData,
  vaultData: VaultData
}

interface Collaborator {
  fullName: string,
  professionalTitle: string,
  affiliatedOrganisation: string
}

interface ResearchPhase {
  title: string,
  description: string,
  result: string,
  fundingGoal: number,
  duration: number,
}

interface User {
  id: string,
  ethAddress?: string,
  biography?: string,
  affiliatedOrganisation?: string,
  firstName?: string,
  lastName?: string,
  professionalTitle: string,
  fullName?: string
  profileImage: string,
}

interface ChainData {
  block: number,
  index: number,
  marketAddress: string,
  vaultAddress: string,
  creatorAddress: string,
  marketData: MarketDataLegacy,
}

interface MarketData {
  lastBlockUpdated: number,
  totalMinted: BigNumber,
  netContributions: Map<string, BigNumber>,
  balances: Map<string, BigNumber>,
  transactions: Array<MintTX | BurnTX | TransferTX>,
}

interface MintTX {
  txType: TransactionType,
  userAddress: string,
  amountMinted: BigNumber,
  collateralAmount: BigNumber,
  reseachContribution: BigNumber,
  blockNumber: number,
  txHash: string,
  timestamp: Date
}

interface BurnTX {
  userAddress: string,
  amountBurnt: BigNumber,
  collateralReturned: BigNumber,
  blockNumber: number,
  txHash: string,
  timestamp: Date
}

interface TransferTX {
  fromAddress: string,
  toAddress: string,
  amount: BigNumber,
  blockNumber: number,
  txHash: string,
  timestamp: Date
}

enum TransactionType {
  MINT = 'MINT',
  BURN = 'BURN',
  TRANSFER = 'TRANSFER'
}

interface VaultData {
  lastBlockUpdated: number,
  totalRaised: BigNumber,
  outstandingWithdraw: BigNumber,
  activePhase: number,
  phases: Array<PhaseData>,
}

interface PhaseData {
  index: number,
  fundingThreshold: BigNumber,
  fundingRaised: BigNumber,
  phaseDuration: number,
  startDate: string,
  state: FundingState
}

enum FundingState { 
  NOT_STARTED, 
  STARTED, 
  ENDED, 
  PAID 
}

interface MarketDataLegacy {
  active: boolean,
  balance: string,
  totalSupply: string,
  decimals: number,
  taxationRate: number,
  tokenPrice: string,
  poolValue: string,
  holdingsValue: string,
}

/* --- STATE --- */
interface ProjectsState {

}

/* --- ACTIONS --- */
type ProjectActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type DomainState = ProjectsState;
type DomainActions = ProjectActions;
type Project = IProject

export { 
  RootState, DomainState, DomainActions, 
  Project, 
  ProjectSubmissionStatus, 
  ChainData as LaunchProjectData, 
  MarketData, 
  MarketDataLegacy, 
  PhaseData, 
  FundingState 
};
