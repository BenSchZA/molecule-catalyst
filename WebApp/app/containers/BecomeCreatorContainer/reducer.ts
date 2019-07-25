/*
 *
 * BecomeCreatorContainer reducer
 *
 */

import ActionTypes from './constants';
import { ContainerState, ContainerActions } from './types';

export const initialState: ContainerState = {
  default: null,
};

function becomeCreatorContainerReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    case ActionTypes.DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default becomeCreatorContainerReducer;