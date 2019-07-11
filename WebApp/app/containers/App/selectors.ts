import jwtDecode from 'jwt-decode';
import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';


/**
 * Direct selector to the user state domain
 */

const selectIsLoggedIn = (state: ApplicationRootState) => {
  try {
    const accessToken = state.authentication.accessToken;
    const decodedToken = jwtDecode(accessToken);
    const isLoggedIn = (Date.now() / 1000 < decodedToken.exp);
    return isLoggedIn;
  } catch (error) {
    return false;
  }
};

const selectCurrentlySending = (state: ApplicationRootState) => {
  return state.app.currentlySending;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by App
 */

const makeSelectIsLoggedIn = () =>
  createSelector(selectIsLoggedIn, substate => {
    return substate;
  });

const makeSelectCurrentlySending = () =>
  createSelector(selectCurrentlySending, substate => {
    return substate;
  });

// export default selectApp;
export { makeSelectIsLoggedIn, makeSelectCurrentlySending };
