/*
 *
 * PortfolioContainer actions
 *
 */

import { createStandardAction } from 'typesafe-actions';

import ActionTypes from './constants';

export const setFilter = createStandardAction(ActionTypes.SET_FILTER)<{text?: string, status?: number}>();
