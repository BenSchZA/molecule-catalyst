import { takeEvery, select, call, put, fork, take } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { ApplicationRootState } from 'types';
import { 
  rejectProject as rejectProjectAPI,
} from '../../api';
import { forwardTo } from 'utils/history';
import { launchProject } from 'domain/projects/actions';
import { setTxInProgress, rejectProject as rejectProjectAction } from './actions';

function* rejectProject(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    yield call(rejectProjectAPI, action.payload, apiKey);
    yield call(forwardTo, '/admin/projects');
  } catch (error) {
    console.log(error);
  }
}

function* launchProjectTxWatcher() {
  while (true) {
    yield take(getType(launchProject.request));
    yield put(setTxInProgress(true));
    yield take([
      getType(launchProject.success),
      getType(launchProject.failure),
    ])
    yield put(setTxInProgress(false));
    yield call(forwardTo, '/admin/projects');
  }
}

export default function* createProjectContainerWatcherSaga() {
  yield put(setTxInProgress(false));
  yield fork(launchProjectTxWatcher);
  yield takeEvery(getType(rejectProjectAction), rejectProject)
}

