import { select, call, put } from "redux-saga/effects";
import { ApplicationRootState } from "types";
import {
  getUser as getUserApi,
  getCreator as getCreatorApi,
} from 'api';
import * as AdminUserViewActions from './actions'
import { normalize } from "normalizr";
import userType from "./schema";
import creatorType from "./schema";

export function* getUser(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getUserApi, action.payload, apiKey);
    const normalised = normalize(result.data, userType);
    yield put(AdminUserViewActions.setUser(normalised.entities));
    if (result.response.ok) {
      
    }
  } catch (error) {
    console.log(error);
  }
}

export function* getCreator(action) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const result = yield call(getCreatorApi, action.payload, apiKey);
    const normalised = normalize(result.data, creatorType);
    yield put(AdminUserViewActions.setCreator(normalised.entities));
    if (result.response.ok) {
      
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* root() {
}
