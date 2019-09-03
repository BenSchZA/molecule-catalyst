/*
 *
 * MyProjectsContainer reducer
 *
 */

import { ContainerState, ContainerActions } from './types';
import * as AdminProjectListingContainerActions from './actions';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  statusFilter: -1,
};

function projectReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    case getType(AdminProjectListingContainerActions.setStatusFilter):
      return {...state,
        statusFilter: action.payload,
      };
    default:
      return state;
  }
}

export default projectReducer;
