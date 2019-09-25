import { createSelector, createStructuredSelector } from 'reselect';
import { Project } from 'domain/projects/types';
import { makeSelectUserId } from 'domain/authentication/selectors';
import { selectAllProjects } from 'domain/projects/selectors';
import { RootState } from 'containers/App/types';
import { StateProps } from '.';
import { ApplicationRootState } from 'types';

const makeSelectMyProjects = createSelector(
    selectAllProjects,
    makeSelectUserId,
    (allProjects, userId) => {
      return (allProjects.filter((project: Project) => project.user.id === userId));
    },
  );

const makeSelectTxInProgress = createSelector(
  (state: ApplicationRootState) => state.myProjectsContainer.txInProgress,
  (txinProgress) => {
    return txinProgress;
  }
)

const selectMyProjects = createStructuredSelector<RootState, StateProps>({
  myProjects: makeSelectMyProjects,
  txInProgress: makeSelectTxInProgress,
});

export default selectMyProjects;
