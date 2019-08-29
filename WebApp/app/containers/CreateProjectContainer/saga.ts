import * as createProjectActions from './actions'
import { takeEvery, select, call } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { ApplicationRootState } from 'types';
import { submitProject as submitProjectApi } from '../../api';
import { forwardTo } from 'utils/history';

export function* submitProject(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(submitProjectApi, action.payload, apiKey);
    if (result.success){
      yield call(forwardTo, '/projects/confirmCreated')
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* createProjectContainerWatcherSaga() {
  yield takeEvery(getType(createProjectActions.submitProject), submitProject)
}
