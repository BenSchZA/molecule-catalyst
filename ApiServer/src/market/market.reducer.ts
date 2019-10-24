import { transferAction, mintAction, burnAction, marketTerminatedAction, setTaxRateAction, setMarketData } from "./market.actions";
import { getType } from "typesafe-actions";
import { BigNumber, bigNumberify } from "ethers/utils";
import { ethers } from "ethers";
import { stat } from "fs";

const calculateNetCost = (transactionsState, action): BigNumber => {
  const transactions = [
    ...transactionsState,
    { txType: action.type, ...action.payload }
  ];
  const mints = transactions.filter(tx => tx.txType === 'MINT'
    && tx.userAddress === action.payload.userAddress);
  
  const totalCollateral = mints.length > 0 ? mints.reduce((prev, current) => prev.add(current.collateralAmount), bigNumberify(0)) : bigNumberify(0);
  const tokensBought = mints.length > 0 ? mints.reduce((prev, current) => prev.add(current.amountMinted), bigNumberify(0)) : bigNumberify(0);
  return mints.length > 0 ? totalCollateral.mul(ethers.utils.parseEther('1')).div(tokensBought) : bigNumberify(0);
}

export interface MarketState {
  active: boolean,
  taxationRate: number,
  tokenPrice: number,
  totalSupply: BigNumber,
  poolValue: BigNumber,
  lastBlockUpdated: number,
  netCost: {
    [s: string]: BigNumber
  },
  balances: {
    [s: string]: BigNumber
  },
  transactions: Array<{
    txType: string,
    userAddress: string,
    amount: BigNumber,
    daiValue: BigNumber,
    blockNumber: number,
    txHash: string,
  }>,
}

export const initialState: MarketState = {
  active: true,
  taxationRate: 0,
  tokenPrice: 0,
  totalSupply: bigNumberify(0),
  poolValue: bigNumberify(0),
  lastBlockUpdated: 0,
  netCost: {},
  balances: {},
  transactions: [],
}


export function MarketReducer(state: MarketState = initialState, action) {
  switch (action.type) {
    case getType(transferAction):
      return {
        ...state,
        lastBlockUpdated: action.payload.blockNumber,
        balances: {
          ...state.balances,
          [action.payload.fromAddress]: state.balances[action.payload.fromAddress].sub(action.payload.amount),
          [action.payload.toAddress]: state.balances[action.payload.toAddress].add(action.payload.amount)
        },
        transactions: [
          ...state.transactions,
          { txType: action.type, ...action.payload }
        ]
      }
    case getType(mintAction):
      return {
        ...state,
        lastBlockUpdated: action.payload.blockNumber,
        netCost: {
          ...state.netCost,
          [action.payload.userAddress]: calculateNetCost(state.transactions, action)
        },
        balances: {
          ...state.balances,
          [action.payload.userAddress]: state.balances && (state.balances[action.payload.userAddress]) ?
            state.balances[action.payload.userAddress].add(action.payload.amountMinted) :
            action.payload.amountMinted
        },
        transactions: [
          ...state.transactions,
          { txType: action.type, ...action.payload }
        ]
      }
    case getType(burnAction):
      return {
        ...state,
        lastBlockUpdated: action.payload.blockNumber,
        balances: {
          ...state.balances,
          [action.payload.userAddress]: (state.balances[action.payload.userAddress]) ?
            state.balances[action.payload.userAddress].sub(action.payload.amountBurnt) :
            action.payload.amountBurnt
        },
        transactions: [
          ...state.transactions,
          { txType: action.type, ...action.payload }
        ]
      }
    case getType(marketTerminatedAction):
      return {
        ...state,
        active: false,
      }
    case getType(setTaxRateAction):
      return {
        ...state,
        taxationRate: action.payload,
      }
    case getType(setMarketData):
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
}