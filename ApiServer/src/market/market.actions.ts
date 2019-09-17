import { createStandardAction, PayloadAC } from 'typesafe-actions';
import { BigNumber } from "ethers/utils";
import { ethers } from 'ethers';

export const mintAction = createStandardAction('MINT')<{
  userAddress: string,
  amountMinted: BigNumber,
  collateralAmount: BigNumber,
  reseachContribution: BigNumber,
  blockNumber: number,
  txHash: string,
  timestamp: Date
}>();

export const burnAction = createStandardAction('BURN')<{
  userAddress: string,
  amountBurnt: BigNumber,
  collateralReturned: BigNumber,
  blockNumber: number,
  txHash: string,
  timestamp: Date
}>();

export const transferAction = createStandardAction('TRANSFER')<{
  fromAddress: string,
  toAddress: string,
  amount: BigNumber,
  blockNumber: number,
  txHash: string,
  timestamp: Date
}>();