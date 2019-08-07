import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';

/**
 * Direct selector to the createProjectContainer state domain
 */

const selectCreateProjectContainerDomain = (state: ApplicationRootState) => {
  return state ? state : {};
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
