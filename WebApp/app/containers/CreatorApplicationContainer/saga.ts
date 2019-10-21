import { select, call, put, take, fork, takeEvery } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';

import * as CreatorApplicationActions from './actions'
import { ApplicationRootState } from 'types';
import { 
  submitCreatorApplication as submitCreatorApplicationApi,
  getCreatorApplication as getCreatorApplicationApi,
  verifyEmail as verifyEmailApi,
} from '../../api'

export function* submitCreatorApplication(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const response = yield call(submitCreatorApplicationApi, action.payload, apiKey);
    yield put(CreatorApplicationActions.submitCreatorApplication.success(response.data))
  } catch (error) {
    yield put(CreatorApplicationActions.submitCreatorApplication.failure(error));
  }
}

export function* getCreatorApplication(){
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getCreatorApplicationApi, apiKey);
    yield put(CreatorApplicationActions.setCreatorApplication(result.data));
  } catch (error) {
    yield put(CreatorApplicationActions.submitCreatorApplication.failure(error));
  }
}

export function* submitCreatorApplicationWatcher() {
  while (true) {
    const action = yield take(getType(CreatorApplicationActions.submitCreatorApplication.request))
    yield call(submitCreatorApplication, action);
  }
}

export function* verifyEmail(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    yield call(verifyEmailApi, action.payload, apiKey);
    yield call(getCreatorApplication);
  } catch (error) {
    console.log(error)
  }
}

export default function* root() {
  yield call(getCreatorApplication);
  yield fork(submitCreatorApplicationWatcher);
  yield takeEvery(getType(CreatorApplicationActions.verifyEmail), verifyEmail)
}
