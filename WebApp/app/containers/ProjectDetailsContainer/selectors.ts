import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

/**
 * Direct selector to the projectDetailsContainer state domain
 */

const selectProjectDetailsContainerDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProjectDetailsContainer
 */

const selectProjectDetailsContainer = () =>
  createSelector(
    selectProjectDetailsContainerDomain,
    substate => {
      return substate;
    },
  );

export default selectProjectDetailsContainer;
export { selectProjectDetailsContainerDomain };
