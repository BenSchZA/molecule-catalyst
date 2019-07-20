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
import { Switch, withRouter } from 'react-router';
import { compose, Dispatch } from 'redux';
import { Redirect, Route } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import { DAEMON } from 'utils/constants';

import AppWrapper from '../../components/AppWrapper/index';
import * as authActions from '../../domain/authentication/actions'
import routes from './routes';
import saga from './saga';
import selectApp from './selectors';

interface OwnProps { }

export interface StateProps {
  isLoggedIn: boolean;
  walletUnlocked: boolean;
  ethAddress: string;
  selectedNetworkName: string;
  userDisplayName: string;
}

export interface DispatchProps {
 onConnect(): void;
}

type Props = StateProps & DispatchProps & OwnProps;
const App: React.SFC<Props> = (props: Props) => {
  return (
    <AppWrapper navRoutes={routes.filter(r => r.isNavRequired)} {...props}>
      <Switch>
        {routes.map(r => {
          return (r.isProtected) ?
            (<PrivateRoute path={r.path} exact component={r.component} isLoggedIn={props.isLoggedIn} key={r.path} />) :
            (<PublicRoute path={r.path} exact component={r.component} isLoggedIn={props.isLoggedIn} key={r.path} />);
        })}
      </Switch>
    </AppWrapper>
  );
};

const mapStateToProps = state => selectApp(state);

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  onConnect: () => dispatch(authActions.authenticate.request()),
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

const PrivateRoute: React.SFC<any> = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return isLoggedIn ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/',
                state: { from: props.location },
              }}
            />
          );
      }
      }
    />
  );
};

const PublicRoute: React.SFC<any> = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return !isLoggedIn ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/dashboard',
                state: { from: props.location },
              }}
            />
          );
        }
      }
    />
  );
};