/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { connect } from 'react-redux';
import { Switch, withRouter, RouteComponentProps } from 'react-router';
import { compose, Dispatch } from 'redux';
import { Redirect, Route } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import { DAEMON } from 'utils/constants';

import AppWrapper from '../../components/AppWrapper/index';
import * as authActions from '../../domain/authentication/actions'
import routes, { AppRoute } from './routes';
import saga from './saga';
import selectApp from './selectors';
import UnauthorizedPage from 'components/UnauthorizedPage';
import NotFoundPage from 'components/NotFoundPage';
import Notifier from '../../domain/notification/notifier';
import { forwardTo } from 'utils/history';
import { isMobile } from 'react-device-detect';
import MobileSplashscreen from 'components/MobileSplashscreen';

interface OwnProps { }

export interface StateProps {
  isLoggedIn: boolean;
  walletUnlocked: boolean;
  approvedNetwork: boolean;
  ethAddress: string;
  daiBalance: number,
  userRole: number;
  approvedNetworkName: string;
}

export interface DispatchProps {
  onConnect(path): void;
  logOut(): void;
}

type Props = StateProps & DispatchProps & OwnProps & RouteComponentProps;



const App: React.FunctionComponent<Props> = (props: Props) => {
  const NotFoundRedirect = () => <Redirect to='/404' />
  const RoleRoute: React.FunctionComponent<any> = ({ component: Component, isAuthorized, ...rest }) => (
    <Route
      {...rest}
      render={props => (
        isAuthorized ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/unauthorized',
                state: { from: props.location },
              }}
            />
          )
      )
      }
    />
  );

  if (isMobile) {
    return <MobileSplashscreen />
  } else {
    return (
      <>
        <Notifier />
        <AppWrapper navRoutes={getNavRoutesForCurrentUser(routes, props.userRole, props.isLoggedIn)} {...props}>
          <Switch>
            {routes.map(r => (
              <RoleRoute path={r.path} exact
                component={r.component}
                isAuthorized={(!r.requireAuth || r.requireAuth && props.isLoggedIn) && (props.userRole >= r.roleRequirement)}
                key={r.path} />)
            )}
            <Route path='/unauthorized' exact component={UnauthorizedPage} />
            <Route path='/404' exact component={NotFoundPage} />
            <Route component={NotFoundRedirect} />
          </Switch>
        </AppWrapper>
      </>
    );
  }
};

function getNavRoutesForCurrentUser(routes: AppRoute[], userRole: number, isLoggedIn: boolean) {
  return routes.filter(r =>
    r.isNavRequired &&  // Exlude any routes that do not require Nav
    (!r.requireAuth || r.requireAuth && isLoggedIn) && // Exclude routes that require Auth, if the user is not logged in 
    userRole >= r.roleRequirement && // Exclude routes that require role priveledges greater than the user
    r.showNavForRoles.includes(userRole) // Exclude any routes that should not be displayed to the user displayed to users.
  )
}

const mapStateToProps = state => selectApp(state);

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  onConnect: (path) => dispatch(authActions.authenticate.request(path)),
  logOut: () => {
    forwardTo('/discover');
    dispatch(authActions.logOut());
  },
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga<OwnProps>({ key: 'app', saga: saga, mode: DAEMON });

export default compose(
  withRouter,
  withSaga,
  withConnect,
)(App);