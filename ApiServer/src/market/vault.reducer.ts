import { getType } from "typesafe-actions";
import { contributeAction, setCurrentPhaseAction, addPhase, updatePhase, setOutstandingWithdraw } from "./vault.actions";
import { BigNumber, bigNumberify } from "ethers/utils";

export enum PhaseState {
  NOT_STARTED,
  STARTED,
  ENDED,
  PAID
}

export interface VaultState {
  lastBlockUpdated: number,
  totalRaised: BigNumber,
  outstandingWithdraw: BigNumber,
  activePhase: number,
  phases: Array<{
    fundingThreshold: BigNumber,
    phaseDuration: number,
    fundingRaised: BigNumber,
    startDate: Date,
    state: PhaseState
  }>,
}

export const initialState: VaultState = {
  lastBlockUpdated: 0,
  outstandingWithdraw: bigNumberify(0),
  totalRaised: bigNumberify(0),
  activePhase: 0,
  phases: [],
}

export function VaultReducer(state = initialState, action) {
  switch (action.type) {
    case getType(contributeAction):
      return {
        ...state,
        lastBlockUpdated: action.payload.blockNumber,
        totalRaised: state.totalRaised.add(action.payload.value),
      }
    case getType(setCurrentPhaseAction):
      return {
        ...state,
        activePhase: action.payload,
      }
    case getType(addPhase):
      return {
        ...state,
        phases: [
          ...state.phases,
          action.payload
        ]
      }
    case getType(updatePhase):
      return {
        ...state,
        phases: updateObjectInArray(state.phases, action.payload)
      }
    case getType(setOutstandingWithdraw):
      return {
        ...state,
        outstandingWithdraw: action.payload,
      }
    default:
      return state;
  }
}

function updateObjectInArray(array, actionPayload) {
  return array.map((item, index) => {
    if (index !== parseInt(actionPayload.index)) {
      return item;
    }

    return actionPayload;
  })
}