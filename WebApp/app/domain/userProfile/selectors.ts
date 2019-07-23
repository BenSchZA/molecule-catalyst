import { createSelector } from "reselect";
import { ApplicationRootState } from "../../types";

const selectUserDisplayName = (state: ApplicationRootState) => {
  return state.userProfile.displayName;
}

const selectUserProfileImage = (state: ApplicationRootState) => {
  return state.userProfile.profileImage;
}

export const makeSelectUserDisplayName = createSelector(selectUserDisplayName, substate => {
  return substate;
})

export const makeSelectUserProfileImage = createSelector(selectUserProfileImage, substate => {
  return substate;
})