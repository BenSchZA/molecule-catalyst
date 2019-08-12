/*
 *
 * MyProjectsContainer reducer
 *
 */

import { ContainerState, ContainerActions } from './types';
import * as DiscoverActions from './actions';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  filter: {
    text: '',
    projectStatus: -1,
  }
};

function projectReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    case getType(DiscoverActions.setFilter):
      return {...state,
        filter: {
          ...state.filter,
          ...action.payload,
        }
      };
    default:
      return state;
  }
}

export default projectReducer;
