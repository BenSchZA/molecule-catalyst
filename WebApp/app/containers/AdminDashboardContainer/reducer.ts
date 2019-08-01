/*
 *
 * AdminDashboardContainer reducer
 *
 */

import { ContainerState, ContainerActions } from './types';
import * as actions from './actions';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  creatorsAwaitingApproval: {},
  allUsers: {}
};

function adminDashboardContainerReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    case getType(actions.setCreatorsAwaitingApproval):
      return {
        ...state,
        creatorsAwaitingApproval: action.payload.creators,
      }
    case getType(actions.setAllUsers):
        return {
          ...state,
          allUsers: action.payload.users,
    }
    default:
      return state;
  }
}

export default adminDashboardContainerReducer;
