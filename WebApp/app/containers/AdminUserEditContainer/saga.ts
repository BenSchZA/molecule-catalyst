import { getType, } from "typesafe-actions";
import * as actions from "./actions";
import { updateUser as updateUserApi } from "../../api"
import { takeLatest, select, call, put } from "redux-saga/effects";
import { ApplicationRootState } from "types";
import { forwardTo } from "utils/history";
import { addProject } from "domain/projects/actions";

export function* updateUser(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(updateUserApi, action.payload.userId, action.payload.data, apiKey);
    if (result.success) {
      yield put(addProject(result.data));
      yield call(forwardTo, `/admin/user/${action.payload.userId}`);
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* adminProjectEditContainerWatcherSaga() {
  yield takeLatest(getType(actions.updateUserAction.request), updateUser);
}
