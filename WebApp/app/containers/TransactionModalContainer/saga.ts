import { setTxInProgress } from "containers/TransactionModalContainer/actions";
import { take, put, fork } from 'redux-saga/effects';
import { getType } from "typesafe-actions";
import { supportProject, withdrawHoldings } from "domain/projects/actions";

function* txWatcher() {
  while (true) {
    yield take([
      getType(supportProject.request), 
      getType(withdrawHoldings.request)
    ]);

    yield put(setTxInProgress(true));
    yield take([
      getType(supportProject.success),
      getType(supportProject.failure),
      getType(withdrawHoldings.success),
      getType(withdrawHoldings.failure),
    ]);

    yield put(setTxInProgress(false));
  }
}

export default function* transactionModalContainerWatcherSaga() {
  yield put(setTxInProgress(false));
  yield fork(txWatcher);
}
