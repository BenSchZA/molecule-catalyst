import { fork, take, put, race, takeLatest } from 'redux-saga/effects';
import rootAuthenticationSaga from 'domain/authentication/saga';

import { setApiSendingFlag } from './actions';

export function* toggleApiSendingFlag(action) {
  try {
    yield put(setApiSendingFlag(true));
    yield race({
      success: take(action.type.replace('_REQUEST', '_SUCCESS')),
      failure: take(action.type.replace('_REQUEST', '_FAILURE'))
    })
  } catch (error) {
  } finally {
    yield put(setApiSendingFlag(false));
  }
}

export function* apiRequestListener() {
  yield takeLatest(action => (action.type.endsWith('_REQUEST')), toggleApiSendingFlag);
}

export default function* appSaga() {
  yield put(setApiSendingFlag(false));
  yield fork(apiRequestListener);
  // Add other global DAEMON sagas here.
  // To prevent performance bottlenecks add sagas with caution.
  yield fork(rootAuthenticationSaga)
}

