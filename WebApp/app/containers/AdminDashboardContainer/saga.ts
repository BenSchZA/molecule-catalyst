import { select, call, put, takeEvery } from "redux-saga/effects";
import { ApplicationRootState } from "types";
import {
  getCreatorApplicationsAwaitingApproval as getCreatorApplicationsAwaitingApprovalApi,
  approveCreatorApplication as approveCreatorApplicationApi
} from 'api';
import * as AdminDashboardActions from './actions'
import { normalize } from "normalizr";
import creatorsAwaitingReview from "./schema";
import { getType } from "typesafe-actions";

export function* getCreatorApplicationsAwaitingApproval() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getCreatorApplicationsAwaitingApprovalApi, apiKey);
    const normalised = normalize(result.data, creatorsAwaitingReview);
    yield put(AdminDashboardActions.setCreatorsAwaitingApproval(normalised.entities));
  } catch (error) {
    console.log(error);
  }
}

export function* getAllUsers() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getCreatorApplicationsAwaitingApprovalApi, apiKey);
    const normalised = normalize(result.data, creatorsAwaitingReview);
    yield put(AdminDashboardActions.setCreatorsAwaitingApproval(normalised.entities));
  } catch (error) {
    console.log(error);
  }
}

export function* approveCreatorApplication(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(approveCreatorApplicationApi, action.payload, apiKey);
    if (result.response.ok) {
      yield call(getCreatorApplicationsAwaitingApproval);
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* root() {
  yield call(getCreatorApplicationsAwaitingApproval);
  yield takeEvery(getType(AdminDashboardActions.approveCreatorApplication), approveCreatorApplication)
}
