import { getType } from 'typesafe-actions';
import { ContainerState, ContainerActions } from './types';
import { setTxInProgress } from './actions';

/*
 *
 * App reducer
 *
 */

export const initialState: ContainerState = {
  txInProgress: false,
};

function AdminProjectReviewReducer(state = initialState, action: ContainerActions) {
  switch (action.type) {
    case getType(setTxInProgress):
      return {
        txInProgress: action.payload
      }
    default:
      return state;
  }
}

export default AdminProjectReviewReducer;
