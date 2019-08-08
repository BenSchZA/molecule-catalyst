/*
 *
 * CreateProjectContainer actions
 *
 */

import { createStandardAction } from 'typesafe-actions';

import ActionTypes from './constants';

export const promoteToAdmin = createStandardAction(ActionTypes.PROMOTE_TO_ADMIN)<string>();
