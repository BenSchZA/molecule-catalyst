import {
  getProjects as getProjectsApi,
  getAllProjects as getAllProjectsApi,
  getMyProjects as getMyProjectsApi,
} from 'api';
import { normalize } from "normalizr";
import projects from './schema';
import * as ProjectActions from './actions';
import * as NotificationActions from '../notification/actions';
import { select, call, all, put, takeLatest, fork } from 'redux-saga/effects';
import { ApplicationRootState } from 'types';
import { getType } from 'typesafe-actions';
import { getProjectTokenDetails, mint, burn, withdrawAvailable } from './chain';
import { Project, MarketDataLegacy } from './types';
import { 
  launchProject as launchProjectAPI,
  addResearchUpdate as addResearchUpdateAPI,
} from '../../api';
import { forwardTo } from 'utils/history';


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
  try {
    const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
    const launchResponse = yield call(launchProjectAPI, action.payload, apiKey);
    yield put(ProjectActions.addProject(launchResponse.data));
    yield put(ProjectActions.launchProject.success());
    yield call(forwardTo, '/admin/projects');
  } catch (error) {
    put(ProjectActions.launchProject.failure(error));
  }
}

export function* supportProject(action) {
  const projectId = action.payload.projectId;
  const contribution = action.payload.contribution;

  const project: Project = yield select((state: ApplicationRootState) => state.projects[projectId]);

  if(project.chainData.index < 0 || project.chainData.marketAddress == "0x") { 
    console.log("Invalid project blockchain data");
    return;
  }

  try {
    yield call(mint, project.chainData.marketAddress, contribution);
    yield put(ProjectActions.supportProject.success(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Successfully funded project', 
      options: { 
        variant: 'success'
      }}
    ));
  } catch (error) {
    yield put(ProjectActions.supportProject.failure(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'The transaction was not successful', 
      options: { 
        variant: 'error'
      }}
    ));
    console.log(error);
  }
}

export function* withdrawHoldings(action) {
  const projectId = action.payload;
  const project: Project = yield select((state: ApplicationRootState) => state.projects[projectId]);

  if(!project.chainData.index || project.chainData.marketAddress == "0x") { 
    console.log("Invalid project blockchain data");
    return;
  }

  try {
    yield call(burn, project.chainData.marketAddress);
    yield put(ProjectActions.withdrawHoldings.success(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Successfully withdrew holdings', 
      options: { 
        variant: 'success',
      }}
    ));
  } catch (error) {
    yield put(ProjectActions.withdrawHoldings.failure(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Error withdrawing holdings', 
      options: { 
        variant: 'error'
      }}
    ));
    console.log(error);
  }
}

export function* withdrawFunding(action) {
  const projectId = action.payload;
  const project: Project = yield select((state: ApplicationRootState) => state.projects[projectId]);

  try {
    yield call(withdrawAvailable, project.chainData.vaultAddress, project.vaultData.phases);
    yield put(ProjectActions.withdrawFunding.success(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Successfully withdrew funding', 
      options: { 
        variant: 'success',
      }}
    ));
  } catch (error) {
    yield put(ProjectActions.withdrawFunding.failure(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Error withdrawing holdings', 
      options: { 
        variant: 'error'
      }}
    ));
    console.log(error);
  }
}

export function* getMarketData(projectId) {
  const project: Project = yield select((state: ApplicationRootState) => state.projects[projectId]);
  
  if(project.chainData.index < 0 || project.chainData.marketAddress == "0x") { 
    console.log("Invalid project blockchain data");
    return;
  }

  try {
    const marketData: MarketDataLegacy = yield call(getProjectTokenDetails, project.chainData.marketAddress);
    yield put(ProjectActions.setMarketData({ projectId: projectId, marketData: marketData }));
  } catch (error) {
    console.log(error);
  }
}

export function* getProjects() {
  try {
    const result = yield call(getProjectsApi);
    const normalised = normalize(result.data, projects);
    yield all(normalised.result.map(projectId => put(ProjectActions.addProject(normalised.entities.projects[projectId]))));
    yield all(normalised.result.map(projectId => fork(getMarketData, projectId)));
  } catch (error) {
    console.log(error);
  }
}

export function* addResearchUpdate(action) {
  const { projectId, update } = action.payload;
  try {
    const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
    yield call(addResearchUpdateAPI, projectId, update, apiKey);
    yield put(ProjectActions.addResearchUpdate.success());
    // yield call(forwardTo, '/admin/projects');
  } catch (error) {
    put(ProjectActions.addResearchUpdate.failure(error));
  }
}

export default function* root() {
  yield takeLatest(getType(ProjectActions.getAllProjects), getAllProjects);
  yield takeLatest(getType(ProjectActions.getMyProjects), getMyProjects);
  yield takeLatest(getType(ProjectActions.getProjects), getProjects);
  yield takeLatest(getType(ProjectActions.launchProject.request), launchProject);
  yield takeLatest(getType(ProjectActions.supportProject.request), supportProject);
  yield takeLatest(getType(ProjectActions.withdrawHoldings.request), withdrawHoldings);
  yield takeLatest(getType(ProjectActions.withdrawFunding.request), withdrawFunding);
  yield takeLatest(getType(ProjectActions.addResearchUpdate.request), addResearchUpdate);
}
