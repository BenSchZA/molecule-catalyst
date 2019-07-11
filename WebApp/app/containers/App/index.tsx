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

import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { createStructuredSelector } from 'reselect';
import { makeSelectIsLoggedIn, makeSelectCurrentlySending } from './selectors';
import saga from './saga';
import { DAEMON } from 'utils/constants';
import AppWrapper from '../../components/AppWrapper';
import reducer from './reducer'
import { RootState } from './types';
import routes from './routes';
import * as authenticationActions from '../../domain/authentication/actions';

function PrivateRoute({ component: Component, isLoggedIn, ...rest }) {
  return (
    <Route
      exact
      {...rest}
      render={props => {
        return isLoggedIn ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          );
      }
      }
    />
  );
}

function PublicRoute({ component: Component, isLoggedIn, ...rest }) {
  return (
    <Route
      exact
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
}

interface OwnProps { }

interface StateProps {
  isLoggedIn: boolean;
  currentlySending: boolean;
}

interface DispatchProps {
  onLogout();
}

type Props = StateProps & DispatchProps & OwnProps;
function App(props: Props) {
  const { isLoggedIn, onLogout, currentlySending } = props;

  // The PublicRoute and PrivateRoute components below should only be used for top level components
  // that will be connected to the store, as no props can be passed down to the child components from here.
  return (
    <AppWrapper 
      isLoggedIn={isLoggedIn} 
      onLogout={onLogout} 
      currentlySending={currentlySending}
      navLinks={routes.filter(r => r.isNavRequired)} >
      <Switch>
        {routes.map(r => {
          const route = (r.isProtected) ?
            (<PrivateRoute path={r.path} exact component={r.component} isLoggedIn={isLoggedIn} key={r.path} />) :
            (<PublicRoute path={r.path} exact component={r.component} isLoggedIn={isLoggedIn} key={r.path} />);
          return route;
        })}
      </Switch>
    </AppWrapper>
  );
}

const mapStateToProps = createStructuredSelector<RootState, StateProps>({
  isLoggedIn: makeSelectIsLoggedIn(),
  currentlySending: makeSelectCurrentlySending(),
});

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => {
    dispatch(authenticationActions.logout());
  },
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer<OwnProps>({key: 'app', reducer: reducer})
const withSaga = injectSaga<OwnProps>({ key: 'app', saga: saga, mode: DAEMON });

export default compose(
  withRouter,
  withReducer,
  withSaga,
  withConnect,
)(App);
