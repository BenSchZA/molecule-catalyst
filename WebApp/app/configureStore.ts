/**
 * Create the store with dynamic reducers
 */

import createReducer from 'reducers';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { LifeStore, ApplicationRootState } from 'types';
import { init as initApm } from '@elastic/apm-rum';

const getPageName = () => {
  var parts = window.location.pathname.split('/'); 
  var pageName = window.location.pathname; 
  if (parts.length > 0) {
      pageName = parts[1] 
  }
  return pageName;
}

const apm = initApm({
  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: process.env.APM_SERVICE_NAME,
  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: process.env.APM_SERVER_ENDPOINT,
  // Set service version (required for sourcemap feature)
  serviceVersion: '',
  pageLoadTransactionName: getPageName()
})

const sagaMiddleware = createSagaMiddleware();

declare interface IWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any; // redux-dev-tools definitions not needed
}
declare const window: IWindow;

const apmLogger = store => next => action => {
  try {
    if(action.type.endsWith('_FAILURE')) {
      console.debug('Caught failure:', action.type);
      const context = {
        id: (store.getState() as ApplicationRootState).authentication.userId,
      }
      apm.setUserContext(context);
      apm.setInitialPageLoadName(getPageName());
      apm.setCustomContext({
        state: store.getState(),
        action: action,
      });
      apm.captureError(new Error(`Action failure: ${action.type}`));
      // Remove state from APM context after capturing error
      apm.setCustomContext({});
      return next(action);
    } else if(action.type.endsWith('_REQUEST')) {
      const transaction = apm.startTransaction(action.type, 'action');
      const span = transaction.startSpan(action.type, 'action');
      const result = next(action);
      span.end();
      transaction.end();
      return result;
    }
  } catch (err) {
    console.error('Caught an exception:', err);
    apm.captureError(err);
    throw err;
  }
}

export default function configureStore(initialState) {
  const middlewares = [apmLogger, sagaMiddleware];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle, indent */
  const composeEnhancers =
    // Uncomment to disable devtools in production
    // process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
          // Prevent recomputing reducers for `replaceReducer`
          shouldHotReload: false,
          trace: true,
          traceLimit: 25
        })
      : compose;
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers),
  ) as LifeStore;

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module['hot']) {
    module['hot'].accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  return store;
}
