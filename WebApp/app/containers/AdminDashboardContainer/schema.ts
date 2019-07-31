import { schema } from 'normalizr';

const creator = new schema.Entity('creators');
const creatorsAwaitingReview = [creator];

export default creatorsAwaitingReview;