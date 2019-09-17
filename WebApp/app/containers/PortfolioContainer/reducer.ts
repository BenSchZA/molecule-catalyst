/*
 *
 * PortfolioContainer reducer
 *
 */

import { ContainerState, ContainerActions } from './types';
import * as PortfolioActions from './actions';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  filter: {
    text: '',
    projectStatus: -1,
  }
};

function projectReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    case getType(PortfolioActions.setFilter):
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
