// import { blockchainResources } from "blockchainResources";

const apiHost = process.env.API_HOST || 'localhost:3001/api';
const apiSchema = process.env.API_SCHEMA || 'http';

const generateUri = (path: string) => `${apiSchema}://${apiHost}/${path}`;

const apiUrlBuilder = {
  getPermit: generateUri('auth/permit'),
  login: generateUri('auth/login'),
  // getUserProfile: (ethAddress: string) => generateUri(`users/${ethAddress}`),
  // updateProfile: generateUri(`users`),
  // sendErrorReport: () => generateUri(`error/${blockchainResources.networkId}`),
  // sendFeedback: () => generateUri(`feedback/${blockchainResources.networkId}`),
};

export default apiUrlBuilder;
