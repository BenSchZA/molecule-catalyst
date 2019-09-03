/*
 *
 * BecomeCreatorContainer actions
 *
 */

import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import { CreatorApplicationData, ContainerState } from './types';

import ActionTypes from './constants';

export const submitCreatorApplication = createAsyncAction(
    ActionTypes.SUBMIT_CREATOR_APPLICATION_REQUEST,
    ActionTypes.SUBMIT_CREATOR_APPLICATION_SUCCESS,
    ActionTypes.SUBMIT_CREATOR_APPLICATION_FAILURE)
    <CreatorApplicationData, ContainerState,Error>();

export const setCreatorApplication = createStandardAction(ActionTypes.SET_CREATOR_APPLICATION)<ContainerState>();

export const verifyEmail = createStandardAction(ActionTypes.VERIFY_EMAIL)<string>();