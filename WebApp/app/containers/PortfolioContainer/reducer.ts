/*
 *
 * PortfolioContainer reducer
 *
 */

import { ContainerState, ContainerActions } from './types';
import { setTxInProgress } from './actions';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  txInProgress: false,
};

function portfolioReducer(state = initialState, action: ContainerActions) {
  switch (action.type) {
    case getType(setTxInProgress):
      return {
        txInProgress: action.payload
      }
    default:
      return state;
  }
}

export default portfolioReducer;
