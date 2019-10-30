/*
 *
 * AdminProjectEditContainer actions
 *
 */

import { createAsyncAction } from 'typesafe-actions';
import { ProjectData } from 'containers/CreateProjectContainer/types';
import { Project } from 'domain/projects/types';

import ActionTypes from './constants';

export const updateProject = createAsyncAction(
    ActionTypes.UPDATE_PROJECT_REQUEST,
    ActionTypes.UPDATE_PROJECT_SUCCESS,
    ActionTypes.UPDATE_PROJECT_FAILURE)
    <{projectId: string, data: ProjectData}, Project, Error>();