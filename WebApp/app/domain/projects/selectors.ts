import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { Project } from 'domain/projects/types';
import { makeSelectUserId } from 'domain/authentication/selectors';

/**
 * Direct selector to the myProjectsContainer state domain
 */

const allProjects = (state: ApplicationRootState) => {
  return state ? state.projects : {};
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by MyProjectsContainer
 */

const selectAllProjects = createSelector(
  allProjects,
  (allProjects) => {
    return Object.values(allProjects) as Array<Project>;
  },
);

const selectMyProjects = createSelector(
    selectAllProjects,
    makeSelectUserId,
    (allProjects, userId) => {
      return (allProjects.filter((project: Project) => project.user === userId));
    },
  );

const selectProject = (projectId: string) => createSelector(
  allProjects,
  (allProjects) => {
    return (allProjects[projectId]);
  }
)

export { selectMyProjects, selectAllProjects, selectProject };
