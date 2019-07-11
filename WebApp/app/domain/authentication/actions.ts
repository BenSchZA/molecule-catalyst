import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import ActionTypes from './constants';

/**
 * Tells the app we want to log out a user
 */
export const logout = createStandardAction(ActionTypes.LOGOUT)();

/**
 * Tells the app we want to register a user
 * @param  {object} data            The data we're sending for registration
 * @param  {string} data.email      The email of the user to register
 * @param  {string} data.password   The password of the user to register
 * @param  {string} data.firstName  The first name of the user to register
 * @param  {string} data.lastName   The last name of the user to register
 */
export const signup = createAsyncAction(
  ActionTypes.SIGNUP_REQUEST,
  ActionTypes.SIGNUP_SUCCESS,
  ActionTypes.SIGNUP_FAILURE)
  <{ email: string, password: string, firstName: string, lastName: string },
    void,
    string
  >();

/**
 * Tells the app we want to register a user
 * @param  {object} data            The data we're sending for registration
 * @param  {string} data.email      The email of the user to register
 * @param  {string} data.password   The password of the user to register
 */
export const login = createAsyncAction(
  ActionTypes.AUTH_REQUEST,
  ActionTypes.AUTH_SUCCESS,
  ActionTypes.AUTH_FAILURE)
  <{ email: string, password: string },
   { userId: string },
   string>();

/**
 * Sets the `error` state as empty
 */
export const clearError = createStandardAction(ActionTypes.CLEAR_ERROR);

/**
 * Saves the user's tokens to the store
 */
export const saveTokens = createStandardAction(ActionTypes.SAVE_TOKENS)
  <{accessToken: string, refreshToken: string}>();

