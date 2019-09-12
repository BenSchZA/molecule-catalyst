import { createStandardAction } from 'typesafe-actions';
import { BigNumber } from "ethers/utils";
import { ethers } from 'ethers';

export const contributeAction = createStandardAction('CONTRIBUTE')<{ value: BigNumber, blockNumber: number }>();
export const setCurrentPhaseAction = createStandardAction('CURRENT_PHASE')<number>();
export const addPhase = createStandardAction('ADD_PHASE')<{ index: number, fundingThreshold: BigNumber, phaseDuration: number, fundingRaised: BigNumber, startDate: Date, state: number }>()
export const updatePhase = createStandardAction('UPDATE_PHASE')<{ index: number, fundingThreshold: BigNumber, phaseDuration: number, fundingRaised: BigNumber, startDate: Date, state: number }>();