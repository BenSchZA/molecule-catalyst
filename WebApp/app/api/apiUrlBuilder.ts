const apiHost = process.env.API_HOST || 'localhost:3001/api';
const apiSchema = process.env.API_SCHEMA || 'http';

const generateUri = (path: string) => `${apiSchema}://${apiHost}/${path}`;

const apiUrlBuilder = {
  login: generateUri('auth/login'),
  refresh: generateUri('auth/refresh'),
  revoke: generateUri('auth/revoke'),
  signUp: generateUri('users'),
  patent: generateUri('patent'),
  patentList: generateUri('patent/list'),
  walletBalances: generateUri('wallet/balances'),
  attachmentStream: (attachmentId: string) => generateUri(`attachment/${attachmentId}/stream`),
  attachmentBase64: (attachmentId: string) => generateUri(`attachment/${attachmentId}/b64`),
  getExchange: generateUri('exchange'),
  getTransactionHistory: (patentId: string) => generateUri(`exchange/${patentId}/transactionHistory`),
  getMarketHistory: (patentId: string) => generateUri(`exchange/${patentId}/marketHistory`),
  createNft: (patentId: string) => generateUri(`patent/${patentId}/createNft`),
  createMarket: (patentId: string) => generateUri(`patent/${patentId}/createMarket`),
  updatePatent: (patentId: string) => generateUri(`patent/${patentId}`),
  buyCost: (patentId: string, tokenAmount: number) => generateUri(`exchange/${patentId}/buyCost/${tokenAmount}`),
  sellReward: (patentId: string, tokenAmount: number) => generateUri(`exchange/${patentId}/sellReward/${tokenAmount}`),
  buy: (patentId: string) => generateUri(`exchange/${patentId}/buy`),
  sell: (patentId: string) => generateUri(`exchange/${patentId}/sell`),
}

export default apiUrlBuilder;
