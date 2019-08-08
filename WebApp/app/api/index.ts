import apiRequest, { RequestMethod } from './apiRequest';
import apiUrlBuilder from './apiUrlBuilder';
import formDataHelper from './formDataHelper';
import { CreatorApplicationData } from 'containers/CreatorApplicationContainer/types';
import { ProjectData } from 'containers/CreateProjectContainer/types';


export function login(signedPermit: string, ethAddress: string): Promise<any> {
  const body = JSON.stringify({ signedPermit: signedPermit, ethAddress: ethAddress});
  return apiRequest(RequestMethod.POST, apiUrlBuilder.login, body, 'application/json');
}

export function getPermit(ethAddress: string): Promise<any>  {
  const body = JSON.stringify({ ethAddress: ethAddress });
  return apiRequest(RequestMethod.POST, apiUrlBuilder.getPermit, body, 'application/json');
}

export async function submitCreatorApplication(creatorApplicationData: CreatorApplicationData, apiToken: string) {
  const requestData = formDataHelper(creatorApplicationData);
  return apiRequest(
    RequestMethod.POST,
    apiUrlBuilder.submitCreatorApplication,
    requestData,
    undefined, // The Content-Type header is set automatically via the FormData object.
    true,
    apiToken);
}

export async function getCreatorApplication(apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.getCreatorApplication, undefined, 'application/json', true, apiToken)
}

export async function getCreatorApplicationsAwaitingApproval(apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.getCreatorApplicationAwaitingApproval, undefined, 'application/json', true, apiToken)
}

export async function getAllProjects(apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.getAllProjects, undefined, 'application/json', true, apiToken)
}

export async function getAllUsers(apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.getAllUsers, undefined, 'application/json', true, apiToken)
}

export async function verifyEmail(token: string, apiToken: string) {
  const body = JSON.stringify({token: token});
  return apiRequest(RequestMethod.POST, apiUrlBuilder.verifyEmail, body, 'application/json', true, apiToken);
}

export async function approveCreatorApplication(applicationId: string, apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.approveCreatorApplication(applicationId), undefined, 'application/json', true, apiToken);
}

export async function rejectCreatorApplication(applicationId: string, apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.rejectCreatorApplication(applicationId), undefined, 'application/json', true, apiToken);
}

export async function getUser(id: string, apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.getUser(id), undefined, 'application/json', true, apiToken);
}

export async function getCreator(id: string, apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.getCreator(id), undefined, 'application/json', true, apiToken);
}

export async function submitProject(projectData: ProjectData, apiToken: string) {
  const requestData = formDataHelper(projectData);
  return apiRequest(
    RequestMethod.POST,
    apiUrlBuilder.submitProject,
    requestData,
    undefined, // The Content-Type header is set automatically via the FormData object.
    true,
    apiToken);
}

export async function promoteToAdmin(userId: string, apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.promoteToAdmin(userId), undefined, 'application/json', true, apiToken);
}

export async function approveProject(projectId: string, apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.approveCreatorApplication(projectId), undefined, 'application/json', true, apiToken);
}

export async function rejectProject(projectId: string, apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.rejectCreatorApplication(projectId), undefined, 'application/json', true, apiToken);
}