import { put } from "redux-saga/effects";
import * as ProjectActions from '../../domain/projects/actions';


export default function* root() {
  yield put(ProjectActions.getMyProjects());
}
