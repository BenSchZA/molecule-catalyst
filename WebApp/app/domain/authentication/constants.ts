/*
 * These are the variables that determine what our central data store (`../reducers/index.js`)
 * changes in our state.
 */

enum ActionTypes {
  AUTH_REQUEST = 'molecule/authentication/AUTH_REQUEST',
  AUTH_SUCCESS = 'molecule/authentication/AUTH_SUCCESS',
  AUTH_FAILURE = 'molecule/authentication/AUTH_FAILURE',
  SIGNUP_REQUEST = 'molecule/authentication/SIGNUP_REQUEST',
  SIGNUP_SUCCESS = 'molecule/authentication/SIGNUP_SUCCESS',
  SIGNUP_FAILURE = 'molecule/authentication/SIGNUP_FAILURE',
  LOGOUT = 'molecule/authentication/LOGOUT',
  SAVE_TOKENS = 'molecule/authentication/SAVE_TOKENS',
  CLEAR_ERROR = 'molecule/authentication/CLEAR_ERROR',
}

export default ActionTypes;
