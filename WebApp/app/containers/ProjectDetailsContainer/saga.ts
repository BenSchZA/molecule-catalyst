import { put, take, fork } from "redux-saga/effects";
import * as ProjectActions from '../../domain/projects/actions';
import * as ProjectDetailsActions from './actions';
import { getType } from "typesafe-actions";

function* txWatcher() {
  while (true) {
    yield take([getType(ProjectActions.supportProject.request), getType(ProjectActions.withdrawFunding.request)]);

    yield put(ProjectDetailsActions.setTxInProgress(true));
    yield take([
      getType(ProjectActions.supportProject.success),
      getType(ProjectActions.supportProject.failure),
      getType(ProjectActions.withdrawFunding.success),
      getType(ProjectActions.withdrawFunding.failure),
    ])
    yield put(ProjectDetailsActions.setTxInProgress(false));
  }
}

export default function* root() {
  yield put(ProjectActions.getProjects());
  yield put(ProjectDetailsActions.setTxInProgress(false));
  yield fork(txWatcher);
}
