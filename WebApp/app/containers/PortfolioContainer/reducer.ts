/*
 *
 * PortfolioContainer reducer
 *
 */

import { ContainerState, ContainerActions } from './types';

export const initialState: ContainerState = {
};

function portfolioReducer(state = initialState, action: ContainerActions) {
  switch (action.type) {

    default:
      return state;
  }
}

export default portfolioReducer;
