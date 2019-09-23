import { put, take, fork } from "redux-saga/effects";
import * as ProjectActions from '../../domain/projects/actions';
import * as MyProjectsActions from './actions';
import { getType } from "typesafe-actions";

function* withdrawTxWatcher() {
  while (true) {
    yield take(getType(ProjectActions.withdrawFunding.request));

    yield put(MyProjectsActions.setTxInProgress(true));
    yield take([
      getType(ProjectActions.withdrawFunding.success),
      getType(ProjectActions.withdrawFunding.failure),
    ])
    yield put(MyProjectsActions.setTxInProgress(false));
  }
}

export default function* root() {
  yield put(ProjectActions.getMyProjects());
  yield put(MyProjectsActions.setTxInProgress(false));
  yield fork(withdrawTxWatcher);
}
