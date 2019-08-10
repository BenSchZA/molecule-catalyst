import {
  getAllProjects as getAllProjectsApi,
} from 'api';
import { normalize } from "normalizr";
import projects from './schema';
import * as ProjectActions from './actions'
import { select, call, all, put, takeEvery } from 'redux-saga/effects';
import { ApplicationRootState } from 'types';
import { getType } from 'typesafe-actions';

export function* getAllProjects() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getAllProjectsApi, apiKey);
    const normalised = normalize(result.data, projects);
    yield all(normalised.result.map(projectId => put(ProjectActions.addProject(normalised.entities.projects[projectId]))))
  } catch (error) {
    console.log(error);
  }
}

export function* getMyProjects() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getAllProjectsApi, apiKey);
    const normalised = normalize(result.data, projects);
    yield all(normalised.result.map(projectId => put(ProjectActions.addProject(normalised.entities.projects[projectId]))))
  } catch (error) {
    console.log(error);
  }
}

export default function* root() {
  yield takeEvery(getType(ProjectActions.getAllProjects), getAllProjects);
  yield takeEvery(getType(ProjectActions.getMyProjects), getMyProjects);
}
