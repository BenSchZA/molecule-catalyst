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
  getAllUsers: generateUri('users/all'),
  approveCreatorApplication: (applicationId: string) => generateUri(`creator/${applicationId}/approve`),
  rejectCreatorApplication: (applicationId: string) => generateUri(`creator/${applicationId}/reject`),
  // getUserProfile: (ethAddress: string) => generateUri(`users/${ethAddress}`),
  // updateProfile: generateUri(`users`),
  // sendErrorReport: () => generateUri(`error/${blockchainResources.networkId}`),
  // sendFeedback: () => generateUri(`feedback/${blockchainResources.networkId}`),
};

export default apiUrlBuilder;
