import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';
import { OptionsObject } from 'notistack';

interface Notification {
  message: string;
  options?: OptionsObject;
}

/* --- STATE --- */
interface NotificationState {
  notifications: Array<{
    key: number,
    message: string,
    variant: string,
    action: Function,
    onClose: Function,
    open: boolean,
    height: number
  }>;
}

/* --- ACTIONS --- */
type NotificationActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type DomainState = NotificationState;
type DomainActions = NotificationActions;

export {
  RootState, DomainState, DomainActions, Notification
};
