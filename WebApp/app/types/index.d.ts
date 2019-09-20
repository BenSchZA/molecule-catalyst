import { Reducer, Store } from 'redux';
import { DomainState as AuthenticationState } from '../domain/authentication/types';
import { DomainState as ProjectsState } from '../domain/projects/types';
import { ContainerState as DiscoverState } from '../containers/DiscoverContainer/types';
import { ContainerState as CreatorApplicationState } from '../containers/CreatorApplicationContainer/types'
import { ContainerState as AdminUserListingState } from '../containers/AdminUserListingContainer/types'
import { ContainerState as CreateProjectContainerState } from '../containers/CreateProjectContainer/types'
import { ContainerState as AdminProjectListingState } from '../containers/AdminProjectListingContainer/types'
import { ContainerState as ProjectDetailsState } from '../containers/ProjectDetailsContainer/types';
import { ContainerState as MyProjectsState } from '../containers/myProjectsContainer/types';

export interface LifeStore extends Store<ApplicationRootState> {
  injectedReducers: any;
  injectedSagas: any;
  runSaga(saga: (() => IterableIterator<any>) | undefined, args: any | undefined): any;
  [Symbol.observable](): Observable<S>;
}

export interface InjectReducerParams {
  key: keyof ApplicationRootState;
  reducer: Reducer<any, any>;
}

export interface InjectSagaParams {
  key: keyof ApplicationRootState;
  saga: () => IterableIterator<any>;
  mode?: string | undefined;
}

// Your root reducer type, which is your redux state types also
export interface ApplicationRootState {
  readonly app: never;
  readonly authentication: AuthenticationState;
  readonly projects: ProjectsState;
  readonly discover: DiscoverState;
  readonly creatorApplication: CreatorApplicationState;
  readonly adminDashboard: AdminUserListingState;
  readonly adminProjectListing: AdminProjectListingState;
  readonly createProjectContainer: never;
  readonly adminUserViewContainer: never;
  readonly adminProjectReviewContainer: never;
  readonly myProjectsContainer: MyProjectsState;
  readonly projectDetailsContainer: ProjectDetailsState;
}
