import { createStandardAction } from "typesafe-actions";
import ActionTypes from "containers/AdminProjectApprovalListingContainer/constants";

export const setProjectsAwaitingApproval = createStandardAction(ActionTypes.SET_PROJECTS_AWAITING_APPROVAL)<any>();