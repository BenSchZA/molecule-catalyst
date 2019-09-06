import * as adminUserActions from './actions'
import { takeEvery, select, call, put } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { ApplicationRootState } from 'types';
import { 
  rejectProject as rejectProjectAPI,
} from '../../api';
import { forwardTo } from 'utils/history';
import { launchProject } from 'domain/projects/actions';

export function* approveProject(action) {
  try {
    // A project is either approved -> started and launched, or rejected
    yield put(launchProject.request(action.payload));
    yield call(forwardTo, '/admin/projects');
  } catch (error) {
    console.log(error);
  }
}

export function* rejectProject(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    yield call(rejectProjectAPI, action.payload, apiKey);
    yield call(forwardTo, '/admin/projects');
  } catch (error) {
    console.log(error);
  }
}

export default function* createProjectContainerWatcherSaga() {
  yield takeEvery(getType(adminUserActions.approveProject), approveProject)
  yield takeEvery(getType(adminUserActions.rejectProject), rejectProject)
}
