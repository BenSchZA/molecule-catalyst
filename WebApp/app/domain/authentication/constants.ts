/*
 *
 * Auth constants
 *
 */

enum ActionTypes {
  AUTH_REQUEST = 'molecule/authentication/AUTH_REQUEST',
  AUTH_SUCCESS = 'molecule/authentication/AUTH_SUCCESS',
  AUTH_FAILURE = 'molecule/authentication/AUTH_FAILURE',
  SAVE_ACCESS_PERMIT = 'molecule/authentication/SAVE_ACCESS_PERMIT',
  SAVE_ACCESS_TOKEN = 'molecule/authentication/SAVE_ACCESS_TOKEN',
  CONNECT_WALLET_REQUEST = 'molecule/authentication/CONNECT_WALLET_REQUEST',
  CONNECT_WALLET_SUCCESS = 'molecule/authentication/CONNECT_WALLET_SUCCESS',
  CONNECT_WALLET_FAILURE = 'molecule/authentication/CONNECT_WALLET_FAILURE',
  LOG_OUT = 'molecule/authentication/LOG_OUT',
  SET_ETH_ADDRESS = 'molecule/authentication/SET_ETH_ADDRESS',
  BROWSER_SIGNING_ERROR = 'molecule/authentication/BROWSER_SIGNING_ERROR',
  SET_NETWORK_ID = 'molecule/authentication/SET_NETWORK_ID',
  SET_USER_TYPE = 'molecule/authentication/SET_USER_TYPE',
  SET_USER_ID = 'molecule/authentication/SET_USER_ID',
  SET_DAI_BALANCE = 'molecule/authentication/SET_DAI_BALANCE',
}

export default ActionTypes;
