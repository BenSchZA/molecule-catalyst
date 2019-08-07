import * as adminUserActions from './actions'
import { takeEvery, select, call } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { ApplicationRootState } from 'types';
import { promoteToAdmin as promoteToAdminApi } from '../../api'
import { forwardTo } from 'utils/history';

export function* approveProject(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  // try {
  //   yield call(promoteToAdminApi, action.payload, apiKey);
  //   yield call(forwardTo, '/admin');
  // } catch (error) {
  //   console.log(error);
  // }
}

export default function* createProjectContainerWatcherSaga() {
  yield takeEvery(getType(adminUserActions.approveProject), approveProject)
}
