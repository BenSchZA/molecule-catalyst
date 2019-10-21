import { put, take, fork } from "redux-saga/effects";
import * as ProjectActions from '../../domain/projects/actions';
import * as PortfolioActions from './actions';
import { getType } from "typesafe-actions";


function* withdrawTxWatcher() {
  while (true) {
    yield take([
      getType(ProjectActions.withdrawHoldings.request),
      getType(ProjectActions.withdrawRedistribution.request),
    ]);

    yield put(PortfolioActions.setTxInProgress(true));
    yield take([
      getType(ProjectActions.withdrawHoldings.success),
      getType(ProjectActions.withdrawHoldings.failure),
      getType(ProjectActions.withdrawRedistribution.success),
      getType(ProjectActions.withdrawRedistribution.failure),
    ])
    yield put(PortfolioActions.setTxInProgress(false));
  }
}

export default function* root() {
  yield put(ProjectActions.getProjects());
  yield put(PortfolioActions.setTxInProgress(false));
  yield fork(withdrawTxWatcher)
}