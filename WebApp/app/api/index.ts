import apiRequest, { RequestMethod } from './apiRequest';
import apiUrlBuilder from './apiUrlBuilder';
import formDataHelper from './formDataHelper';
import { CreatorApplicationData } from 'containers/CreatorApplicationContainer/types';
import { ProjectData } from 'containers/CreateProjectContainer/types';

export class apiClient {
  private readonly apiToken: string;
  constructor() {
    const state = JSON.parse(localStorage.getItem('state') || '{}');
    this.apiToken = state?.authentication?.accessToken;
  }

  uploadSupportingDocument(file: File) {
    const requestData = new FormData();
    requestData.append('file', file, file.name);
    return apiRequest(
      RequestMethod.POST,
      apiUrlBuilder.uploadFile,
      requestData,
      undefined,
      true,
      this.apiToken
    )
  }
}

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

export async function getProjects() {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.getProjects, undefined, 'application/json')
}

export async function getMyProjects(apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.getMyProjects, undefined, 'application/json', true, apiToken)
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
  return apiRequest(RequestMethod.GET, apiUrlBuilder.approveProject(projectId), undefined, 'application/json', true, apiToken);
}

export async function rejectProject(projectId: string, apiToken: string) {
  return apiRequest(RequestMethod.GET, apiUrlBuilder.rejectProject(projectId), undefined, 'application/json', true, apiToken);
}

export async function launchProject(projectId: string, apiToken: string) {
  return apiRequest(RequestMethod.POST, apiUrlBuilder.launchProject(projectId), undefined, 'application/json', true, apiToken);
}

export async function addResearchUpdate(projectId: string, update: string, apiToken: string) {
  const body = JSON.stringify({researchUpdate: update});
  return apiRequest(
    RequestMethod.POST,
    apiUrlBuilder.addResearchUpdate(projectId),
    body,
    'application/json', 
    true,
    apiToken);
}