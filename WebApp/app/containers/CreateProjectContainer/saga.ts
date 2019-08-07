import * as createProjectActions from './actions'
import { takeEvery, select, call } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { ApplicationRootState } from 'types';
import { submitProject as submitProjectApi } from '../../api'

export function* submitProject(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const response = yield call(submitProjectApi, action.payload, apiKey);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

export default function* createProjectContainerWatcherSaga() {
  yield takeEvery(getType(createProjectActions.submitProject), submitProject)
}
