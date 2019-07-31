import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';

/**
 * Direct selector to the becomeCreatorContainer state domain
 */

const selectCreatorApplicationDomain = (state: ApplicationRootState) => {
  return state.creatorApplication
};

const makeSelectCreatorApplicationContainer = createSelector(
  selectCreatorApplicationDomain,
  substate => {
    return substate;
  },
);


const creatorApplicationState = createStructuredSelector<RootState, StateProps>({
  application: makeSelectCreatorApplicationContainer,
})

export default creatorApplicationState;