/*
 *
 * User Profile constants
 *
 */

enum ActionTypes {
  GET_PROFILE_REQUEST = 'molecule/userProfile/GET_PROFILE_REQUEST',
  GET_PROFILE_SUCCESS = 'molecule/userProfile/GET_PROFILE_SUCCESS',
  GET_PROFILE_FAILURE = 'molecule/userProfile/GET_PROFILE_FAILURE',
  SET_PROFILE_REQUEST = 'molecule/userProfile/SET_PROFILE_REQUEST',
  SET_PROFILE_SUCCESS = 'molecule/userProfile/SET_PROFILE_SUCCESS',
  SET_PROFILE_FAILURE = 'molecule/userProfile/SET_PROFILE_FAILURE',
  SEND_FEEDBACK_REQUEST = 'molecule/userProfile/SEND_FEEDBACK_REQUEST',
  SEND_FEEDBACK_SUCCESS = 'molecule/userProfile/SEND_FEEDBACK_SUCCESS',
  SEND_FEEDBACK_FAILURE = 'molecule/userProfile/SEND_FEEDBACK_FAILURE',
  SET_PENDING_RESPONSE = 'molecule/userProfile/SET_PENDING_RESPONSE',
}

export default ActionTypes;
