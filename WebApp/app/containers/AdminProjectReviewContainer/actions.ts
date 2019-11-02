/*
 *
 * CreateProjectContainer actions
 *
 */

import { createStandardAction } from 'typesafe-actions';

import ActionTypes from './constants';

export const approveProject = createStandardAction(ActionTypes.APPROVE_PROJECT)<{projectId: string, researchContributionRate: number}>();
export const rejectProject = createStandardAction(ActionTypes.REJECT_PROJECT)<string>();
