import { createStandardAction } from "typesafe-actions";
import ActionTypes from "containers/AdminProjectApprovalListingContainer/constants";

export const setProjects = createStandardAction(ActionTypes.SET_PROJECTS)<any>();