import { Reducer, Store } from 'redux';
import { ContainerState as GlobalState } from '../containers/App/types';
import { ContainerState as DashboardState } from '../containers/DashboardContainer/types';
import { DomainState as AuthenticationState } from '../domain/authentication/types';
import { DomainState as UserProfileState } from '../domain/userProfile/types';
import { ContainerState as CreatorApplicationState } from '../containers/CreatorApplicationContainer/types'
import { ContainerState as AdminDashboardState } from '../containers/AdminDashboardContainer/types'
import { ContainerState as AdminUserViewState } from '../containers/AdminUserViewContainer/types'



export interface LifeStore extends Store<{}> {
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
  readonly global: GlobalState;
  readonly dashboard: DashboardState;
  readonly authentication: AuthenticationState;
  readonly userProfile: UserProfileState;
  readonly creatorApplication: CreatorApplicationState;
  readonly adminUserView: AdminUserViewState;
  readonly adminDashboard: AdminDashboardState;
}
