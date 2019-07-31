import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

export interface CreatorApplicationData {
  email: string,
  firstName: string,
  lastName: string,
  profileImage: File,
  biography: string,
  professionalTitle: string,
  affiliatedOrganisation: string,
}

enum CreatorApplicationStatus {
  created,
  awaitingEmailVerification,
  awaitingVerification,
  accepted,
  rejected
}

/* --- STATE --- */
interface CreatorApplicationContainerState {
  id?: string;
  user?: ObjectId | string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  profileImage?: ObjectId | string,
  biography?: string,
  professionalTitle?: string,
  affiliatedOrganisation?: string,
  emailVerified?: boolean,
  status?: CreatorApplicationStatus,
}

/* --- ACTIONS --- */
type CreatorApplicationContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = CreatorApplicationContainerState;
type ContainerActions = CreatorApplicationContainerActions;

export { RootState, ContainerState, ContainerActions, CreatorApplicationStatus };
