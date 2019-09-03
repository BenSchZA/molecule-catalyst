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
import { deployMarket } from './chainInteractions';
import { Project, LaunchProjectData } from './types';
import { launchProject as launchProjectAPI } from '../../api';

interface Market {
  fundingGoals: number[], 
  phaseDurations: number[], 
  curveType: number, 
  taxationRate: number
}

export function* getAllProjects() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getAllProjectsApi, apiKey);
    const normalised = normalize(result.data, projects);
    yield all(normalised.result.map(projectId => put(ProjectActions.addProject(normalised.entities.projects[projectId]))));
  } catch (error) {
    console.log(error);
  }
}

export function* getMyProjects() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getMyProjectsApi, apiKey);
    const normalised = normalize(result.data, projects);
    yield all(normalised.result.map(projectId => put(ProjectActions.addProject(normalised.entities.projects[projectId]))));
  } catch (error) {
    console.log(error);
  }
}

export function* launchProject(action) {
  const projectID = action.payload;
  const project: Project = yield select((state) => state.projects[action.payload]);

  try {
    let newMarket: Market = {
      fundingGoals: [],
      phaseDurations: [],
      curveType: 0,
      taxationRate: 0,
    };

    newMarket.curveType = 0; //TODO: add curve type to data type - for now hard code
    newMarket.fundingGoals = project.researchPhases.map(value => value.fundingGoal);
    newMarket.phaseDurations = project.researchPhases.map(value => value.duration);
    newMarket.taxationRate = 15; //TODO: add tax rate to data type - for now hard code

    let result: LaunchProjectData = {
      ...(yield call(deployMarket,
                      newMarket.fundingGoals,
                      newMarket.phaseDurations,
                      newMarket.curveType,
                      newMarket.taxationRate,
                     ))
    };

    const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
    yield call(launchProjectAPI, action.payload, result, apiKey);
    put(ProjectActions.launchProject.success(projectID));

  } catch (error) {
    console.log(error);
    put(ProjectActions.launchProject.failure(projectID));
  }
}

export function* getProjects() {
  try {
    const result = yield call(getProjectsApi);
    const normalised = normalize(result.data, projects);
    yield all(normalised.result.map(projectId => put(ProjectActions.addProject(normalised.entities.projects[projectId]))));
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
