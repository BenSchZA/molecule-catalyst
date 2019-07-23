// import window from'./window.mock';
// import * as authenticationActions from '../actions';
// import * as userProfileActions from '../../userProfile/actions';
// import { expectSaga } from 'redux-saga-test-plan';
// import * as matchers from 'redux-saga-test-plan/matchers';
// import { throwError } from 'redux-saga-test-plan/providers';
// import {  login } from '../../../api/api';
// import { forwardTo } from '../../../utils/history';
// import jwtDecode from 'jwt-decode';

describe('getAccessToken', () => {
  test.todo('returns an access token for a valid permit')

  test.todo('fails on invalid permit')

  test.todo('fails on the server side')
})

describe('connectWallet', () => {
  test.todo('successfully calls the wallet connect if available')

  test.todo('fails gracefully when the user denies authorization')

  test.todo('test with window.ethereum as undefined, but still valid web3')

  test.todo('test with window.ethereum as undefined, and window.web3 undefined')
})

//This saga only runs when the user is logged in
describe('addressChangeListener', () => {
  test.todo('test the addressChangeListener')
})

describe('loginFlow', () => {
  test.todo('test the loginFlow')
})

describe('refreshTokenPoller', () => {
  test.todo('test the refreshTokenPoller')
})

describe('getPermit', () => {
  test.todo('test the getPermit')
})

describe('rootAuthenticationSaga', () => {
  test.todo('test the rootAuthenticationSaga');
})
