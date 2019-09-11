import { transferAction, mintAction, burnAction } from "./market.actions";
import { getType } from "typesafe-actions";
import { BigNumber, bigNumberify } from "ethers/utils";

export interface MarketState {
  lastBlockUpdated: number,
  totalMinted: BigNumber,
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
  lastBlockUpdated: 0,
  totalMinted: bigNumberify(0),
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
          {txType: action.type, ...action.payload}
        ]
      }
    case getType(mintAction):      
      return {
        ...state,
        lastBlockUpdated: action.payload.blockNumber,
        totalMinted: state.totalMinted.add(action.payload.amountMinted),
        balances: {
          ...state.balances,
          [action.payload.userAddress]: (state.balances[action.payload.userAddress]) ? 
            state.balances[action.payload.userAddress].add(action.payload.amountMinted) : 
            action.payload.amountMinted
        },
        transactions: [
          ...state.transactions,
          {txType: action.type, ...action.payload}
        ]
      }
    case getType(burnAction):
      return {
        ...state,
        lastBlockUpdated: action.payload.blockNumber,
        totalMinted: state.totalMinted.sub(action.payload.amount),
        balances: {
          ...state.balances,
          [action.payload.userAddress]: state.balances[action.payload.userAddress].sub(action.payload.amountBurnt)
        },
        transactions: [
          ...state.transactions,
          {txType: action.type, ...action.payload}
        ]
      }
    default:
      return state;
  }
}