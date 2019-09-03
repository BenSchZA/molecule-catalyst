import * as adminUserActions from './actions'
import { takeEvery, select, call, put } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { ApplicationRootState } from 'types';
import { promoteToAdmin as promoteToAdminApi } from '../../api'
import { forwardTo } from 'utils/history';
import { getAllUsers as getAllUsersApi } from 'api';
import * as AdminDashboardActions from '../AdminUserListingContainer/actions';
import { users } from "../AdminUserListingContainer/schema";
import { normalize } from "normalizr";

export function* promoteToAdmin(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    yield call(promoteToAdminApi, action.payload, apiKey);
    yield call(forwardTo, '/admin/users');
  } catch (error) {
    console.log(error);
  }
}
export function* getAllUsers() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getAllUsersApi, apiKey);
    
    const normalised = normalize(result.data, users);
    yield put(AdminDashboardActions.setAllUsers(normalised.entities));
  } catch (error) {
    console.log(error);
  }
}
export default function* createProjectContainerWatcherSaga() {
  yield call(getAllUsers);
  yield takeEvery(getType(adminUserActions.promoteToAdmin), promoteToAdmin)
}
