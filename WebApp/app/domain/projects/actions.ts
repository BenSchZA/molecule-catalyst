/*
 *
 * MyProjectsContainer actions
 *
 */

import { createStandardAction } from 'typesafe-actions';
import { Project } from './types';

import ActionTypes from './constants';

export const addProject = createStandardAction(ActionTypes.ADD_PROJECT)<Project>();
export const getAllProjects = createStandardAction(ActionTypes.GET_ALL_PROJECTS)<undefined>();
export const getMyProjects = createStandardAction(ActionTypes.GET_MY_PROJECTS)<undefined>();
