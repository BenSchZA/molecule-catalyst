export interface TransactionDatapoint {
  timestamp: string;
  blockNumber: number;
  transactionHash: string;
  tokenAmount: number;
  daiAmount: number;
  firstTokenPrice: number;
}
