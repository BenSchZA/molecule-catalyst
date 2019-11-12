/*
 *
 * MyProjectsContainer reducer
 *
 */

import { DomainState, DomainActions } from './types';
import * as NotificationActions from './actions';
import { getType } from 'typesafe-actions';

export const initialState: DomainState = {
  notifications: [],
};

function notificationReducer(state: DomainState = initialState, action: DomainActions) {
  switch (action.type) {
    case getType(NotificationActions.enqueueSnackbar):
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.payload.options.key,
            ...action.payload,
          }
        ]
      }
    case getType(NotificationActions.enqueueCustomSnackbar):
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.payload.options.key,
            ...action.payload,
          }
        ]
      }
    case getType(NotificationActions.closeSnackbar):
      return {
        ...state,
        notifications: state.notifications.map(notification => (
          (action.payload.dismissAll || notification.key === action.payload.key)
            ? { ...notification, dismissed: true }
            : { ...notification }
        ))
      }
    case getType(NotificationActions.removeSnackbar):
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.key !== action.payload,
        )
      }
    default:
      return state;
  }
}

export default notificationReducer;
