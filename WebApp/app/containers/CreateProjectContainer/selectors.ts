import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

/**
 * Direct selector to the createProjectContainer state domain
 */

const selectCreateProjectContainerDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateProjectContainer
 */

const selectCreateProjectContainer = () =>
  createSelector(
    selectCreateProjectContainerDomain,
    substate => {
      return substate;
    },
  );

export default selectCreateProjectContainer;
export { selectCreateProjectContainerDomain };
