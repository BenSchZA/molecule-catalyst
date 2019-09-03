import { createStandardAction } from "typesafe-actions";
import ActionTypes from "containers/AdminProjectListingContainer/constants";

export const setStatusFilter = createStandardAction(ActionTypes.SET_STATUS_FILTER)<number>();
