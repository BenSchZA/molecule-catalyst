/*
 *
 * LoginPage reducer
 *
 */

// import ActionTypes from './constants';
// import ActionTypes from '../App/constants';
// import * as authenticationActions from '../../domain/authentication/actions';
import { DomainActions as AuthenticationActions } from '../../domain/authentication/types'
import { ContainerState } from './types';
// import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  error: '',
};

function loginPageReducer(state: ContainerState = initialState, action: AuthenticationActions) {
  switch (action.type) {
    default:
      return state;
  }
}

export default loginPageReducer;
