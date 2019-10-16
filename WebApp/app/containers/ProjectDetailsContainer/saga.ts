import { put } from "redux-saga/effects";
import { getProjects } from "domain/projects/actions";

export default function* root() {
  yield put(getProjects());
}
