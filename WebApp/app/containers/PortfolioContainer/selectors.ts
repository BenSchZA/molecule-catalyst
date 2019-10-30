import { createStructuredSelector, createSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';
import { selectAllProjects } from 'domain/projects/selectors';
import { ApplicationRootState } from 'types';
/**
 * Direct selector to the PortfolioContainer state domain
 */

const selectByAddress = (state: ApplicationRootState) => {
  return state ? state.authentication.ethAddress : "";
};

const makeSelectAddress = createSelector(
  selectByAddress,
  (address) => {
    return address;
  },
);

const makeSelectBackedProjects = createSelector(
  selectAllProjects,
  makeSelectAddress,
  (allProjects, address) => {
    const allBackedProjects = allProjects.filter(p => {
      return p.marketData && p.marketData.balances && 
      p.marketData.balances[address]
    });
    return allBackedProjects;
  },
);

const selectPortfolioContainer = createStructuredSelector<RootState, StateProps>({
  projects: makeSelectBackedProjects,
  userAddress: makeSelectAddress,
});

export default selectPortfolioContainer;
