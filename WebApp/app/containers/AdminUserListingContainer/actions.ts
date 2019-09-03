import { createStandardAction } from "typesafe-actions";
import ActionTypes from "containers/AdminUserListingContainer/constants";

export const setCreatorsAwaitingApproval = createStandardAction(ActionTypes.SET_CREATORS_AWAITING_APPROVAL)<any>();
export const setAllUsers = createStandardAction(ActionTypes.SET_ALL_USERS)<any>();
export const approveCreatorApplication = createStandardAction(ActionTypes.APPROVE_CREATOR_APPLICATION)<string>();
export const rejectCreatorApplication = createStandardAction(ActionTypes.REJECT_CREATOR_APPLICATION)<string>();