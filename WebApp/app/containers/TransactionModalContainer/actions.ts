/*
 *
 * TransactionModalContainer actions
 *
 */

import { createStandardAction } from 'typesafe-actions';
import {} from './types';

import ActionTypes from './constants';

export const setTxInProgress = createStandardAction(ActionTypes.SET_TX_IN_PROGRESS)<boolean>();

