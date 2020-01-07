/*
 *
 * AdminProjectEditContainer actions
 *
 */

import { createAsyncAction } from 'typesafe-actions';
import ActionTypes from './constants';
import { UserData } from './types';

export const updateUserAction = createAsyncAction(
    ActionTypes.UPDATE_USER_REQUEST,
    ActionTypes.UPDATE_USER_SUCCESS,
    ActionTypes.UPDATE_USER_FAILURE)
    <{userId: string, data: UserData}, undefined, Error>();