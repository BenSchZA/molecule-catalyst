import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

/**
 * Direct selector to the becomeCreatorContainer state domain
 */

const selectBecomeCreatorContainerDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by BecomeCreatorContainer
 */

const selectBecomeCreatorContainer = () =>
  createSelector(
    selectBecomeCreatorContainerDomain,
    substate => {
      return substate;
    },
  );

export default selectBecomeCreatorContainer;
export { selectBecomeCreatorContainerDomain };
