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
    return (allProjects) ? Object.values(allProjects) : [];
  },
);

const selectMyProjects = createSelector(
    selectAllProjects,
    makeSelectUserId,
    (allProjects, userId) => {
      return (allProjects.filter((project: Project) => project.user === userId));
    },
  );

export { selectMyProjects, selectAllProjects };
