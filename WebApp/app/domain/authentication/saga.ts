import { call, put, take } from 'redux-saga/effects';
import { forwardTo } from '../../utils/history';
// import jwtDecode from 'jwt-decode';
import { login } from '../../api/api';
import ActionTypes from './constants';
import * as authenticationActions from './actions';
import { getType } from 'typesafe-actions';
// import { signup } from './actions';

export function* authorize({ email, password }) {
  try {
    let response;
    response = yield call(login, email, password);
    return response;
  } catch (error) {
    yield put(authenticationActions.login.failure(error.message));
  }
}

export function* loginFlow() {
  while (true) {
    const request = yield take(ActionTypes.AUTH_REQUEST);
    const { email, password } = request.payload;

    const authResult = yield call(authorize, { email: email, password: password });

    if (authResult && authResult.success) {
      yield put(authenticationActions.saveTokens({ accessToken: authResult.data.accessToken, refreshToken: authResult.data.refreshToken }))
      yield call(forwardTo, '/dashboard');
      // Ensure that this action fires last, as otherwise this generator is cancelled before it is able to complete
      // This is a bit of a leaky implementation, and could be improved.
      yield put(authenticationActions.login.success({ userId: authResult.data.userId }));
    }
  }
}

export default function* rootAuthenticationSaga() {
  while (true) {
    yield take(getType(authenticationActions.logout));
  }
}
