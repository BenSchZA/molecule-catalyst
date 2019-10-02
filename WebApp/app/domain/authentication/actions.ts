import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import ActionTypes from './constants';

export const authenticate = createAsyncAction(
  ActionTypes.AUTH_REQUEST,
  ActionTypes.AUTH_SUCCESS,
  ActionTypes.AUTH_FAILURE)
  <void, void, string>();

export const saveAccessPermit = createStandardAction(ActionTypes.SAVE_ACCESS_PERMIT)<string>();
export const saveAccessToken = createStandardAction(ActionTypes.SAVE_ACCESS_TOKEN)<string>();
export const setNetworkId = createStandardAction(ActionTypes.SET_NETWORK_ID)<number>();
export const setEthAddress = createStandardAction(ActionTypes.SET_ETH_ADDRESS)<string>();
export const setDaiBalance = createStandardAction(ActionTypes.SET_DAI_BALANCE)<number>();
export const setUserId = createStandardAction(ActionTypes.SET_USER_ID)<string>();
export const setUserRole = createStandardAction(ActionTypes.SET_USER_TYPE)<number>();
export const logOut = createStandardAction(ActionTypes.LOG_OUT)();

export const connectWallet = createAsyncAction(
  ActionTypes.CONNECT_WALLET_REQUEST,
  ActionTypes.CONNECT_WALLET_SUCCESS,
  ActionTypes.CONNECT_WALLET_FAILURE)
  <void, 
  { 
    ethAddress: string, 
    networkId: number, 
    approvedNetwork: boolean, 
    approvedNetworkName: string 
  }, 
  string>();
