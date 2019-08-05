import { createStandardAction } from "typesafe-actions";
import ActionTypes from "containers/AdminUserViewContainer/constants";

export const setUser = createStandardAction(ActionTypes.SET_USER)<any>();
export const setCreator = createStandardAction(ActionTypes.SET_CREATOR)<any>();
