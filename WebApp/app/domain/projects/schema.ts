import { schema } from 'normalizr';

export const project = new schema.Entity('projects');
const projects = [project];

export default projects;