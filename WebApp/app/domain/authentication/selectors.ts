import { createSelector } from "reselect";
import { ApplicationRootState } from "types";
import jwtDecode from 'jwt-decode';

// const networkNames = {
//   1: 'Homestead',
//   3: 'Ropsten',
//   4: 'Rinkeby',
//   42: 'Kovan',
//   77: 'Sokol',
//   99: 'POA',
//   100: 'XDai'
// };

const selectIsLoggedIn = (state: ApplicationRootState) => {
  const accessToken = state.authentication.accessToken;
  try {
    const decodedToken = jwtDecode(accessToken);
    const isLoggedIn = (Date.now() / 1000 < decodedToken.exp);
    return isLoggedIn;
  } catch (error) {
    return false;
  }
};

const selectUserId = (state: ApplicationRootState) => {
  const accessToken = state.authentication.accessToken;
  try {
    const decodedToken = jwtDecode(accessToken);
    return decodedToken.userId;
  } catch (error) {
    return false;
  }
};

const selectUserRole = (state: ApplicationRootState) => {
  return state.authentication.userRole;
};

const selectWalletUnlocked = (state: ApplicationRootState) => {
  return state.authentication.walletUnlocked;
};

const selectEthAddress = (state: ApplicationRootState) => {
  return state.authentication.ethAddress;
};

const selectDaiBalance = (state: ApplicationRootState) => {
  return state.authentication.daiBalance;
};

export const makeSelectIsLoggedIn = createSelector(selectIsLoggedIn, substate => {
  return substate;
});

export const makeSelectUserId = createSelector(selectUserId, substate => {
  return substate;
});

export const makeSelectWalletUnlocked = createSelector(selectWalletUnlocked, substate => {
  return substate;
});

export const makeSelectEthAddress = createSelector(selectEthAddress, substate => {
  return substate;
});

export const makeSelectDaiBalance = createSelector(selectDaiBalance, substate => {
  return substate;
});

export const makeSelectUserRole = createSelector(selectUserRole, substate => {
  return substate;
});

export const makeSelectApprovedNetwork = createSelector(
  (state: ApplicationRootState) => state.authentication.approvedNetwork,
  approvedNetwork => { return approvedNetwork }
)

export const makeSelectApprovedNetworkName = createSelector(
  (state: ApplicationRootState) => state.authentication.approvedNetworkName,
  approvedNetworkName => { return approvedNetworkName }
)