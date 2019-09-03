import { schema } from 'normalizr';

const creator = new schema.Entity('creators');
const user = new schema.Entity('users');
const creatorsAwaitingReview = [creator];
const users = [user];

export {creatorsAwaitingReview, users};