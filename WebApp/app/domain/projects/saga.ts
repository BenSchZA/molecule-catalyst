import {
  getProjects as getProjectsApi,
  getAllProjects as getAllProjectsApi,
  getMyProjects as getMyProjectsApi,
} from 'api';
import { normalize } from "normalizr";
import projects from './schema';
import * as ProjectActions from './actions'
import { select, call, all, put, takeLatest } from 'redux-saga/effects';
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
    const result = yield call(getMyProjectsApi, apiKey);
    const normalised = normalize(result.data, projects);
    yield all(normalised.result.map(projectId => put(ProjectActions.addProject(normalised.entities.projects[projectId]))))
  } catch (error) {
    console.log(error);
  }
}

export function* launchProject(action) {
  try {
    console.log('Launch project', action.payload);
    // TODO Call market factory and update the project on the API.
  } catch (error) {
    console.log(error);
  }
}

export function* getProjects() {
  try {
    const result = yield call(getProjectsApi);
    const normalised = normalize(result.data, projects);
    yield all(normalised.result.map(projectId => put(ProjectActions.addProject(normalised.entities.projects[projectId]))))
  } catch (error) {
    console.log(error);
  }
}

export default function* root() {
  yield takeLatest(getType(ProjectActions.getAllProjects), getAllProjects);
  yield takeLatest(getType(ProjectActions.getMyProjects), getMyProjects);
  yield takeLatest(getType(ProjectActions.getProjects), getProjects);
  yield takeLatest(getType(ProjectActions.launchProject.request), launchProject)
}
