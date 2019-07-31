/*
 *
 * BecomeCreatorContainer reducer
 *
 */

import { ContainerState, ContainerActions } from './types';
import * as actions from './actions';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  user: undefined,
  firstName: undefined,
  lastName: undefined,
  fullName: undefined,
  email: undefined,
  profileImage: undefined,
  biography: undefined,
  professionalTitle: undefined,
  affiliatedOrganisation: undefined,
  emailVerified: undefined,
  status: undefined,
};

function creatorApplicationContainerReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    case getType(actions.submitCreatorApplication.success):
    case getType(actions.setCreatorApplication):
      return {...action.payload}
    default:
      return state;
  }
}

export default creatorApplicationContainerReducer;