import { setTxInProgress } from "containers/TransactionModalContainer/actions";
import { take, put, fork } from 'redux-saga/effects';
import { getType } from "typesafe-actions";
import { supportProject, withdrawFunding } from "domain/projects/actions";

function* txWatcher() {
  while (true) {
    yield take([
      getType(supportProject.request), 
      getType(withdrawFunding.request)
    ]);

    yield put(setTxInProgress(true));
    yield take([
      getType(supportProject.success),
      getType(supportProject.failure),
      getType(withdrawFunding.success),
      getType(withdrawFunding.failure),
    ]);

    yield put(setTxInProgress(false));
  }
}

export default function* transactionModalContainerWatcherSaga() {
  yield put(setTxInProgress(false));
  yield fork(txWatcher);
}
