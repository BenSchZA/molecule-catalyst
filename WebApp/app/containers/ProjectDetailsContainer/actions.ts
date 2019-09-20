import { createStandardAction } from 'typesafe-actions';
import ActionTypes from './constants';

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export const setTxInProgress = createStandardAction(ActionTypes.SET_TX_IN_PROGRESS)<boolean>();