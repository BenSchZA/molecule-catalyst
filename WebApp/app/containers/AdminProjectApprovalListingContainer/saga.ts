import { select, call, put } from "redux-saga/effects";
import { ApplicationRootState } from "types";
import {
  getProjectApplicationsAwaitingApproval as getProjectsAwaitingApprovalApi,
} from 'api';
import * as AdminProjectListingActions from './actions'
import { normalize } from "normalizr";
import projects from './schema';

export function* getProjectsAwaitingApproval() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getProjectsAwaitingApprovalApi, apiKey);
    const normalised = normalize(result.data, projects);
    yield put(AdminProjectListingActions.setProjectsAwaitingApproval(normalised.entities));
  } catch (error) {
    console.log(error);
  }
}

export default function* root() {
  yield call(getProjectsAwaitingApproval);
}
