import apiRequest from './apiRequest';
import apiUrlBuilder from './apiUrlBuilder';
// import formDataHelper from './formDataHelper';

export function login(email: string, password: string): Promise<any> {
  const body = JSON.stringify({ email: email, password: password });
  return apiRequest('POST', apiUrlBuilder.login, body, 'application/json');
}
