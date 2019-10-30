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
    default:
      return state;
  }
}

export default projectReducer;
