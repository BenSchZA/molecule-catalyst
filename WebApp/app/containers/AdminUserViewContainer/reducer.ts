/*
 *
 * AdminUserViewContainer reducer
 *
 */

import { ContainerState, ContainerActions } from './types';
import * as actions from './actions';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  user: {},
  creator: {}
};

function adminUserViewContainerReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    case getType(actions.setUser):
      return {
        ...state,
        user: action.payload.user,
      }
      case getType(actions.setCreator):
        return {
          ...state,
          user: action.payload.creator,
        }
    default:
      return state;
  }
}

export default adminUserViewContainerReducer;
