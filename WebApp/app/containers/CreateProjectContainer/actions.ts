/*
 *
 * CreateProjectContainer actions
 *
 */

import { createStandardAction } from 'typesafe-actions';

import ActionTypes from './constants';

export const submitProject = createStandardAction(ActionTypes.SUBMIT_PROJECT)<any>();
