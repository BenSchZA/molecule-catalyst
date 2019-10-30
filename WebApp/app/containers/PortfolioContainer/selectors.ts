import { createStructuredSelector, createSelector } from 'reselect';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';
import { selectAllProjects } from 'domain/projects/selectors';
import { ApplicationRootState } from 'types';
import { bigNumberify, parseEther } from 'ethers/utils';
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
      p.marketData.balances[address] &&
      bigNumberify(p.marketData.balances[address]).gt(parseEther('0.000000001')) //Only show projects with positive balances at 9 digits
    });
    return allBackedProjects;
  },
);

const selectPortfolioContainer = createStructuredSelector<RootState, StateProps>({
  projects: makeSelectBackedProjects,
  userAddress: makeSelectAddress,
});

export default selectPortfolioContainer;
