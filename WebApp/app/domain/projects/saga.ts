import {
  getProjects as getProjectsApi,
  getAllProjects as getAllProjectsApi,
  getMyProjects as getMyProjectsApi,
} from 'api';
import { normalize } from "normalizr";
import projects, { project } from './schema';
import * as ProjectActions from './actions';
import * as NotificationActions from '../notification/actions';
import { select, call, all, put, takeLatest, fork, take } from 'redux-saga/effects';
import { ApplicationRootState } from 'types';
import { getType } from 'typesafe-actions';
import { mint, burn, withdrawAvailable, withdraw } from './chain';
import { Project } from './types';
import {
  launchProject as launchProjectAPI,
  addResearchUpdate as addResearchUpdateAPI,
} from '../../api';
import { eventChannel } from 'redux-saga';
import io from 'socket.io-client';
import apiUrlBuilder from 'api/apiUrlBuilder';
import TransactionSuccessNotification from 'components/TransactionSuccessNotification';
import React from 'react';
import ReactGA from 'react-ga';

let socket;

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
    const launchResponse = yield call(launchProjectAPI, action.payload.projectId, action.payload.researchContributionRate, apiKey);
    yield put(ProjectActions.addProject(launchResponse.data));
    yield put(ProjectActions.launchProject.success());
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Project has been successfully launched',
      options: {
        variant: 'success',
      }
    }))
  } catch (error) {
    yield put(ProjectActions.launchProject.failure(error));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'There was an error launching the project',
      options: {
        variant: 'error',
      }
    }))
  }
}

export function* supportProject(action) {
  const { projectId, contribution } = action.payload;

  const project: Project = yield select((state: ApplicationRootState) => state.projects[projectId]);

  if (project.chainData.index < 0 || project.chainData.marketAddress == "0x") {
    console.log("Invalid project blockchain data");
    return;
  }

  try {
    yield call(mint, project.chainData.marketAddress, contribution);
    yield put(ProjectActions.supportProject.success(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: '',
      options: {
        variant: 'success',
        content: React.createElement(TransactionSuccessNotification, {projectTitle: project.title}),
      }
    }));
  } catch (error) {
    yield put(ProjectActions.supportProject.failure(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'The transaction was not successful',
      options: {
        variant: 'error',
        
      }
    }
    ));
    console.log(error);
  }

  ReactGA.event({
    category: "ProjectsSaga",
    action: "supportProject",
  });
}

export function* withdrawRedistribution(action) {
  const { projectId, tokenAmount } = action.payload;
  const project: Project = yield select((state: ApplicationRootState) => state.projects[projectId]);

  if (project.chainData.index < 0 || project.chainData.marketAddress == "0x") {
    console.log("Invalid project blockchain data");
    return;
  }

  try {
    yield call(withdraw, project.chainData.marketAddress, tokenAmount);
    yield put(ProjectActions.withdrawRedistribution.success(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Successfully withdrew redistribution',
      options: {
        variant: 'success',
      }
    }
    ));
  } catch (error) {
    yield put(ProjectActions.withdrawRedistribution.failure(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Error withdrawing redistribution',
      options: {
        variant: 'error'
      }
    }
    ));
    console.log(error);
  }
}

export function* withdrawHoldings(action) {
  const { projectId, tokenAmount } = action.payload;
  const project: Project = yield select((state: ApplicationRootState) => state.projects[projectId]);

  if (project.chainData.index < 0 || project.chainData.marketAddress == "0x") {
    console.log("Invalid project blockchain data");
    return;
  }

  try {
    yield call(burn, project.chainData.marketAddress, tokenAmount);
    yield put(ProjectActions.withdrawHoldings.success(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Successfully withdrew holdings',
      options: {
        variant: 'success',
      }
    }
    ));
  } catch (error) {
    yield put(ProjectActions.withdrawHoldings.failure(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Error withdrawing holdings',
      options: {
        variant: 'error'
      }
    }
    ));
    console.log(error);
  }
}

export function* withdrawFunding(action) {
  const projectId = action.payload;
  const project: Project = yield select((state: ApplicationRootState) => state.projects[projectId]);

  try {
    yield call(withdrawAvailable, project.chainData.vaultAddress);
    yield put(ProjectActions.withdrawFunding.success(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Successfully withdrew funding',
      options: {
        variant: 'success',
      }
    }
    ));
  } catch (error) {
    yield put(ProjectActions.withdrawFunding.failure(projectId));
    yield put(NotificationActions.enqueueSnackbar({
      message: 'Error withdrawing holdings',
      options: {
        variant: 'error'
      }
    }
    ));
    console.log(error);
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

export function* addResearchUpdate(action) {
  const { projectId, update } = action.payload;
  try {
    const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
    yield call(addResearchUpdateAPI, projectId, update, apiKey);
    yield put(ProjectActions.addResearchUpdate.success());
    yield put(NotificationActions.enqueueSnackbar({ message: 'Update successfully added', options: { variant: 'success' } }))
  } catch (error) {
    put(ProjectActions.addResearchUpdate.failure(error));
    put(NotificationActions.enqueueSnackbar({ message: 'Something went wrong. Please contact the admin', options: { variant: 'error' } }))
  }
}

const connect = async () => {
  socket = io(apiUrlBuilder.websocket);
  return new Promise((resolve) => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
};

const createSocketEventChannel = socket => eventChannel((emit) => {
  socket.on('project', (data) => {
    emit({ type: 'projectUpdated', value: data })
  })
  socket.on('projects', (data) => {
    emit({ type: 'projects', value: data })
  })
  return () => { };
});

export function* websocket() {
  const socket = yield call(connect);
  const socketChannel = yield call(createSocketEventChannel, socket);
  while (true) {
    const payload = yield take(socketChannel);
    if (payload.type === 'projectUpdated') {
      const normalised = normalize(payload.value, project);
      yield put(ProjectActions.addProject(normalised.entities.projects[normalised.result]));
    } else {
      const normalised = normalize(payload.value, projects);
      yield all(normalised.result.map(projectId => put(ProjectActions.addProject(normalised.entities.projects[projectId]))));
    }
  }
}

export default function* root() {
  yield fork(websocket);
  yield takeLatest(getType(ProjectActions.getAllProjects), getAllProjects);
  yield takeLatest(getType(ProjectActions.getMyProjects), getMyProjects);
  yield takeLatest(getType(ProjectActions.launchProject.request), launchProject);
  yield takeLatest(getType(ProjectActions.supportProject.request), supportProject);
  yield takeLatest(getType(ProjectActions.withdrawHoldings.request), withdrawHoldings);
  yield takeLatest(getType(ProjectActions.withdrawRedistribution.request), withdrawRedistribution);
  yield takeLatest(getType(ProjectActions.withdrawFunding.request), withdrawFunding);
  yield takeLatest(getType(ProjectActions.addResearchUpdate.request), addResearchUpdate);
}
