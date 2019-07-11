import { getType } from 'typesafe-actions';
import { ContainerState, ContainerActions } from './types';
import { setApiSendingFlag } from './actions';

/*
 *
 * App reducer
 *
 */

export const initialState: ContainerState = {
  currentlySending: false,
};

function appReducer(state = initialState, action: ContainerActions) {
  switch (action.type) {
    case getType(setApiSendingFlag):
      return {
        currentlySending: action.payload
      }
    default:
      return state;
  }
}

export default appReducer;
