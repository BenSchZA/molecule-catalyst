/*
 *
 * AdminProjectApprovalListingContainer reducer
 *
 */

import { ContainerState, ContainerActions } from './types';
import * as actions from './actions';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  projects: {},
};

function adminProjectApprovalListingContainerReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    case getType(actions.setProjects):
      return {
        ...state,
        projects: action.payload.projects,
      }
    default:
      return {
        ...state
      }
  }
}

export default adminProjectApprovalListingContainerReducer;
