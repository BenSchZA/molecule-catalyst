/*
 *
 * LoginPage reducer
 *
 */

import { DomainActions as AuthenticationActions } from '../../domain/authentication/types'
import { ContainerState } from './types';
// import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  error: '',
};

function signupPageReducer(state: ContainerState = initialState, action: AuthenticationActions) {
  switch (action.type) {
    default:
      return state;
  }
}

export default signupPageReducer;
