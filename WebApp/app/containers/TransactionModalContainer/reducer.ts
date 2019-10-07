/*
 *
 * TransactionModalContainer reducer
 *
 */

import { ContainerState, ContainerActions } from './types';
import { setTxInProgress } from 'containers/TransactionModalContainer/actions';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  txInProgress: false,
};

function transactionModalReducer(state = initialState, action: ContainerActions) {
  switch (action.type) {
    case getType(setTxInProgress):
      return {
        txInProgress: action.payload
      }
    default:
      return state;
  }
}
export default transactionModalReducer;
