import { createStandardAction } from "typesafe-actions";
import ActionTypes from "containers/AdminDashboardContainer/constants";

export const setCreatorsAwaitingApproval = createStandardAction(ActionTypes.SET_CREATORS_AWAITING_APPROVAL)<any>();
export const setAllUsers = createStandardAction(ActionTypes.SET_ALL_USERS)<any>();
export const approveCreatorApplication = createStandardAction(ActionTypes.APPROVE_CREATOR_APPLICATION)<string>();