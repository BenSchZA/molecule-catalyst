import { getType } from 'typesafe-actions';
// import ActionTypes from './constants';
import { DomainState, DomainActions } from './types';
import * as authenticationActions from './actions';

/*
 *
 * App reducer
 *
 */

export const initialState: DomainState = {
  refreshToken: '',
  accessToken: '',
  userId: '',
};

function appReducer(state: DomainState = initialState, action: DomainActions) {
  switch (action.type) {
    case getType(authenticationActions.login.success):
      return { 
        ...state, 
        ...action.payload,
      };
    case getType(authenticationActions.logout):
      return {
        ...initialState,
      };
    case getType(authenticationActions.saveTokens):
      return {
        ...state, 
        ...action.payload,
      }
    default:
      return state;
  }
}

export default appReducer;
