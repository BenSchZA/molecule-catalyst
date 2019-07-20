import apiRequest from './apiRequest';
import apiUrlBuilder from './apiUrlBuilder';
// import formDataHelper from './formDataHelper';

export function login(signedPermit: string, ethAddress: string): Promise<any> {
  const body = JSON.stringify({ signedPermit: signedPermit, ethAddress: ethAddress});
  return apiRequest('POST', apiUrlBuilder.login, body, 'application/json');
}

export function getPermit(ethAddress: string): Promise<any>  {
  const body = JSON.stringify({ ethAddress: ethAddress });
  return apiRequest('POST', apiUrlBuilder.getPermit, body, 'application/json');
}