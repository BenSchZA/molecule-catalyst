// import { blockchainResources } from "blockchainResources";

const apiHost = process.env.API_HOST || 'localhost:3001/api';
const apiSchema = process.env.API_SCHEMA || 'http';

const generateUri = (path: string) => `${apiSchema}://${apiHost}/${path}`;

const apiUrlBuilder = {
  getPermit: generateUri('auth/permit'),
  login: generateUri('auth/login'),
  attachmentStream: (attachmentId: string) => generateUri(`attachment/${attachmentId}/stream`),
  submitCreatorApplication: generateUri('creator/apply'),
  getCreatorApplication: generateUri('creator'),
  verifyEmail: generateUri('creator/verifyEmail'),
  getCreatorApplicationAwaitingApproval: generateUri('creator/awaitingApproval'),
  getAllProjects : generateUri('projects/all'),
  getAllUsers: generateUri('users/all'),
  approveCreatorApplication: (applicationId: string) => generateUri(`creator/${applicationId}/approve`),
  rejectCreatorApplication: (applicationId: string) => generateUri(`creator/${applicationId}/reject`),
  getUser: (id: string) => generateUri(`users/${id}`),
  getCreator: (id: string) => generateUri(`creator/${id}`),
  submitProject: generateUri('projects/submit'),
  promoteToAdmin: (userId: string) => generateUri(`users/${userId}/promoteToAdmin`),
};

export default apiUrlBuilder;
