// import { blockchainResources } from "blockchainResources";

const apiHost = process.env.API_HOST || 'localhost:3001';
const apiSchema = process.env.API_SCHEMA || 'http';

const generateUri = (path: string) => `${apiSchema}://${apiHost}/${path}`;

const apiUrlBuilder = {
  getPermit: generateUri('api/auth/permit'),
  login: generateUri('api/auth/login'),
  attachmentStream: (attachmentId: string) => generateUri(`api/attachment/${attachmentId}/stream`),
  submitCreatorApplication: generateUri('api/creator/apply'),
  getCreatorApplication: generateUri('api/creator'),
  verifyEmail: generateUri('api/creator/verifyEmail'),
  getCreatorApplicationAwaitingApproval: generateUri('api/creator/awaitingApproval'),
  getProjects : generateUri('api/project/'),
  getAllProjects : generateUri('api/project/all'),
  getMyProjects : generateUri('api/project/my'),
  getAllUsers: generateUri('api/users/all'),
  approveCreatorApplication: (applicationId: string) => generateUri(`api/creator/${applicationId}/approve`),
  rejectCreatorApplication: (applicationId: string) => generateUri(`api/creator/${applicationId}/reject`),
  getUser: (id: string) => generateUri(`api/users/${id}`),
  getCreator: (id: string) => generateUri(`api/creator/${id}`),
  submitProject: generateUri('api/project/submit'),
  promoteToAdmin: (userId: string) => generateUri(`api/users/${userId}/promoteToAdmin`),
  approveProject: (projectId: string) => generateUri(`api/project/${projectId}/approve`),
  rejectProject: (projectId: string) => generateUri(`api/project/${projectId}/reject`),
  launchProject: (projectId: string) => generateUri(`api/project/${projectId}/launch`),
  addResearchUpdate: (projectId: string) => generateUri(`api/project/${projectId}/update`),
  uploadFile: generateUri(`api/attachment/`),
  updateProject: (projectId: string) => generateUri(`api/project/${projectId}`),
  updateUser: (userId: string) => generateUri(`api/users/${userId}`),
  websocket: generateUri(''),
};

export default apiUrlBuilder;
