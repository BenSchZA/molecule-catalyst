import { getType, } from "typesafe-actions";
import * as actions from "./actions";
import { updateProject as updateProjectApi } from "../../api"
import { takeLatest, select, call, put } from "redux-saga/effects";
import { ApplicationRootState } from "types";
import { forwardTo } from "utils/history";
import { addProject } from "domain/projects/actions";

export function* updateProject(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(updateProjectApi, action.payload.projectId, action.payload.data, apiKey);
    debugger;
    if (result.success) {
      yield put(addProject(result.data));
      yield call(forwardTo, `/admin/project/${action.payload.projectId}`);
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* adminProjectEditContainerWatcherSaga() {
  yield takeLatest(getType(actions.updateProject.request), updateProject);
}
