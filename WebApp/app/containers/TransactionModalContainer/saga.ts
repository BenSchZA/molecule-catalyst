import { setTxInProgress } from "containers/TransactionModalContainer/actions";
import { take, put, fork } from 'redux-saga/effects';
import { getType } from "typesafe-actions";
import { supportProject, withdrawHoldings, withdrawRedistribution, getProjects } from "domain/projects/actions";

function* txWatcher() {
  while (true) {
    yield take([
      getType(supportProject.request), 
      getType(withdrawHoldings.request),
      getType(withdrawRedistribution.request),
    ]);

    yield put(setTxInProgress(true));
    yield take([
      getType(supportProject.success),
      getType(supportProject.failure),
      getType(withdrawHoldings.success),
      getType(withdrawHoldings.failure),
      getType(withdrawRedistribution.success),
      getType(withdrawRedistribution.failure),
    ]);

    yield put(setTxInProgress(false));
    yield put(getProjects());
  }
}

export default function* transactionModalContainerWatcherSaga() {
  yield put(setTxInProgress(false));
  yield fork(txWatcher);
}
