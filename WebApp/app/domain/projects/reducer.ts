/*
 *
 * MyProjectsContainer reducer
 *
 */

import { DomainState, DomainActions } from './types';
import * as ProjectActions from './actions';
import { getType } from 'typesafe-actions';

export const initialState: DomainState = {};

function projectReducer(state: DomainState = initialState, action: DomainActions ) {
  switch (action.type) {
    case getType(ProjectActions.addProject):
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        }
      };
    case getType(ProjectActions.setMarketData):
      return{
        ...state,
        [action.payload.projectId]: {
          ...state[action.payload.projectId],
          chainData: {
            ...state[action.payload.projectId].chainData,
            marketData: {
              ...action.payload.marketData,
            },
          }
        }
      };
    default:
      return state;
  }
}

export default projectReducer;
