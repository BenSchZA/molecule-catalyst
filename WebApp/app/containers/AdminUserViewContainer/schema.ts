import { schema } from 'normalizr';

const creator = new schema.Entity('creators');
const user = new schema.Entity('users');
const creatorType = [creator];
export const userType = [user];

export default creatorType;