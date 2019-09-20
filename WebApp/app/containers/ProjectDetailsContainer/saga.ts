import { put, take, fork } from "redux-saga/effects";
import * as ProjectActions from '../../domain/projects/actions';
import * as ProjectDetailsActions from './actions';
import { getType } from "typesafe-actions";

function* supportTxWatcher() {
  while (true) {
    yield take([getType(ProjectActions.supportProject.request), getType(ProjectActions.withdrawFunding.request)]);

    yield put(ProjectDetailsActions.setTxInProgress(true));
    yield take([
      getType(ProjectActions.supportProject.success),
      getType(ProjectActions.supportProject.failure),
    ])
    yield put(ProjectDetailsActions.setTxInProgress(false));
  }
}

function* withdrawTxWatcher() {
  while (true) {
    yield take(getType(ProjectActions.withdrawHoldings.request));

    yield put(ProjectDetailsActions.setTxInProgress(true));
    yield take([
      getType(ProjectActions.withdrawHoldings.success),
      getType(ProjectActions.withdrawHoldings.failure),
    ])
    yield put(ProjectDetailsActions.setTxInProgress(false));
  }
}

export default function* root() {
  yield put(ProjectActions.getProjects());
  yield put(ProjectDetailsActions.setTxInProgress(false));
  yield fork(supportTxWatcher);
  yield fork(withdrawTxWatcher)
}
