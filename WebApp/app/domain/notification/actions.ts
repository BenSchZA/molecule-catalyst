/*
 *
 * MyProjectsContainer actions
 *
 */

import { createStandardAction } from 'typesafe-actions';
import { Notification } from './types';

import ActionTypes from './constants';

export const enqueueSnackbar = createStandardAction(ActionTypes.ENQUEUE_SNACKBAR).map(
  (notification: Notification) => {
    const key = notification.options && notification.options.key;

    return {
      payload: {
        message: notification.message,
        options: {
          ...notification.options,
          key: key || new Date().getTime() + Math.random(),
        },
      }
    }
  }
)

export const removeSnackbar = createStandardAction(ActionTypes.REMOVE_SNACKBAR)<number>();

export const closeSnackbar = createStandardAction(ActionTypes.CLOSE_SNACKBAR).map(
  (key?: string | number) => ({
    payload: {
      dismissAll: !key,
      key
    },
  })
)