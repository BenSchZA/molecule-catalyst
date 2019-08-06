import { select, call, put } from "redux-saga/effects";
import { ApplicationRootState } from "types";
import {
  getCreatorApplicationsAwaitingApproval as getCreatorApplicationsAwaitingApprovalApi,
} from 'api';
import * as AdminDashboardActions from './actions'
import { normalize } from "normalizr";
import projectsAwaitingApproval from './schema';

export function* getProjectsAwaitingApproval() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getCreatorApplicationsAwaitingApprovalApi, apiKey);
    const normalised = normalize(result.data, projectsAwaitingApproval);
    yield put(AdminDashboardActions.setProjectsAwaitingApproval(normalised.entities));
  } catch (error) {
    console.log(error);
  }
}

export default function* root() {
  yield call(getProjectsAwaitingApproval);
}
