/*
 *
 * CreateProjectContainer actions
 *
 */

import { createStandardAction } from 'typesafe-actions';

import ActionTypes from './constants';

export const rejectProject = createStandardAction(ActionTypes.REJECT_PROJECT)<string>();
export const setTxInProgress = createStandardAction(ActionTypes.SET_TX_IN_PROGRESS)<boolean>();