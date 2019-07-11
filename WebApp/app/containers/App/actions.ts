import { createStandardAction } from 'typesafe-actions';
import ActionTypes from './constants';

export const setApiSendingFlag = createStandardAction(ActionTypes.SET_API_SENDING_FLAG)<boolean>();