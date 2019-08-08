import { createStandardAction } from "typesafe-actions";
import ActionTypes from "containers/AdminProjectListingContainer/constants";

export const setProjects = createStandardAction(ActionTypes.SET_PROJECTS)<any>();