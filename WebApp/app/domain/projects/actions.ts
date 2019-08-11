/*
 *
 * MyProjectsContainer actions
 *
 */

import { createStandardAction, createAsyncAction } from 'typesafe-actions';
import { Project } from './types';

import ActionTypes from './constants';

export const addProject = createStandardAction(ActionTypes.ADD_PROJECT)<Project>();
export const getAllProjects = createStandardAction(ActionTypes.GET_ALL_PROJECTS)<undefined>();
export const getMyProjects = createStandardAction(ActionTypes.GET_MY_PROJECTS)<undefined>();
export const getProjects = createStandardAction(ActionTypes.GET_PROJECTS)<undefined>();
export const launchProject = createAsyncAction(
  ActionTypes.LAUNCH_PROJECT_REQUEST,
  ActionTypes.LAUNCH_PROJECT_SUCCESS,
  ActionTypes.LAUNCH_PROJECT_FAILURE)
  <string, string, Error>();
