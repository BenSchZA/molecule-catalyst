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
import routes from './routes';
import saga from './saga';
import selectApp from './selectors';
import UnauthorizedPage from 'components/UnauthorizedPage';
import NotFoundPage from 'components/NotFoundPage';
import { forwardTo } from 'utils/history';

interface OwnProps { }

export interface StateProps {
  isLoggedIn: boolean;
  walletUnlocked: boolean;
  ethAddress: string;
  selectedNetworkName: string;
  userDisplayName: string;
  userRole: number;
}

export interface DispatchProps {
 onConnect(): void;
 logOut(): void;
}

type Props = StateProps & DispatchProps & OwnProps & RouteComponentProps;

const RoleRoute: React.FunctionComponent<any> = ({ component: Component, isAuthorized, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return isAuthorized ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/unauthorized',
                state: { from: props.location },
              }}
            />
          );
        }
      }
    />
  );
};

const App: React.SFC<Props> = (props: Props) => {
  const NotFoundRedirect = () => <Redirect to='/404' />
  return (
    <AppWrapper navRoutes={routes.filter(r => 
        r.isNavRequired && 
        (!r.requireAuth || r.requireAuth && props.isLoggedIn) && 
        props.userRole >= r.roleRequirement && 
        r.showNavForRoles.includes(props.userRole))} {...props}>
      <Switch>
        {routes.map(r => (
          <RoleRoute path={r.path} exact component={r.component} isAuthorized={props.userRole >= r.roleRequirement} key={r.path} />)
        )}
        <Route path='/unauthorized' exact component={UnauthorizedPage} />
        <Route path='/404' exact component={NotFoundPage} />
        <Route component={NotFoundRedirect} />
      </Switch>
    </AppWrapper>
  );
};

const mapStateToProps = state => selectApp(state);

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  onConnect: () => dispatch(authActions.authenticate.request()),
  logOut: () => {
    forwardTo('/discover'),
    dispatch(authActions.logOut())},
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga<OwnProps>({ key: 'global', saga: saga, mode: DAEMON });

export default compose(
  withRouter,
  withSaga,
  withConnect,
)(App);