import { select, call, put } from "redux-saga/effects";
import { ApplicationRootState } from "types";
import {getCreatorApplicationsAwaitingApproval as getCreatorApplicationsAwaitingApprovalApi } from 'api';
import * as AdminDashboardActions from './actions'
import { normalize } from "normalizr";
import creatorsAwaitingReview from "./schema";

export function* getCreatorApplicationsAwaitingApproval(){
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getCreatorApplicationsAwaitingApprovalApi, apiKey);
    console.log(result.data);
    const normalised = normalize(result.data, creatorsAwaitingReview);
    console.log(normalised);
    yield put(AdminDashboardActions.setCreatorsAwaitingApproval(normalised.entities));
  } catch (error) {
    console.log(error);
  }
}

export default function* root() {
  yield call(getCreatorApplicationsAwaitingApproval)
}
