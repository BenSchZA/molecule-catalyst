import * as adminUserActions from './actions'
import { takeEvery, select, call } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { ApplicationRootState } from 'types';
import { 
  approveProject as approveProjectApi,
  rejectProject as rejectProjectApi,
} from '../../api'
import { forwardTo } from 'utils/history';

export function* approveProject(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    yield call(approveProjectApi, action.payload, apiKey);
    yield call(forwardTo, '/admin/projects');
  } catch (error) {
    console.log(error);
  }
}

export function* rejectProject(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    yield call(rejectProjectApi, action.payload, apiKey);
    yield call(forwardTo, '/admin/projects');
  } catch (error) {
    console.log(error);
  }
}

export default function* createProjectContainerWatcherSaga() {
  yield takeEvery(getType(adminUserActions.approveProject), approveProject)
  yield takeEvery(getType(adminUserActions.rejectProject), rejectProject)
}
