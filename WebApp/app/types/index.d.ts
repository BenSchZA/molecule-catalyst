import { Reducer, Store } from 'redux';
import { ContainerState as AppState } from '../containers/App/types';
import { DomainState as AuthenticationState } from '../domain/authentication/types';
import { ContainerState as LoginPageState } from '../containers/LoginPage/types';
import { ContainerState as SignupPageState } from '../containers/SignUpPage/types';

export interface LifeStore extends Store {
  injectedReducers: any;
  injectedSagas: any;
  runSaga(saga: (() => IterableIterator<any>) | undefined, args: any | undefined): any;
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
  readonly app: AppState;
  readonly authentication: AuthenticationState;
  readonly loginPage: LoginPageState;
  readonly signupPage: SignupPageState;
}
