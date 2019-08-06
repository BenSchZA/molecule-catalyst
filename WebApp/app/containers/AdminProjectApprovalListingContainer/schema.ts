import { schema } from 'normalizr';

const project = new schema.Entity('projects');
const projectsAwaitingApproval = [project];

export default projectsAwaitingApproval;