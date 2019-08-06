/*
 *
 * CreateProjectContainer actions
 *
 */

import { createStandardAction } from 'typesafe-actions';
import {} from './types';

import ActionTypes from './constants';

export const submitProject = createStandardAction(ActionTypes.SUBMIT_PROJECT)<any>();
