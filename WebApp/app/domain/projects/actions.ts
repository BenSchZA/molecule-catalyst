/*
 *
 * MyProjectsContainer actions
 *
 */

import { createStandardAction, createAsyncAction } from 'typesafe-actions';
import { Project, MarketDataLegacy } from './types';

import ActionTypes from './constants';

export const addProject = createStandardAction(ActionTypes.ADD_PROJECT)<Project>();
export const getAllProjects = createStandardAction(ActionTypes.GET_ALL_PROJECTS)<undefined>();
export const getMyProjects = createStandardAction(ActionTypes.GET_MY_PROJECTS)<undefined>();
export const getProjects = createStandardAction(ActionTypes.GET_PROJECTS)<undefined>();
export const launchProject = createAsyncAction(
  ActionTypes.LAUNCH_PROJECT_REQUEST,
  ActionTypes.LAUNCH_PROJECT_SUCCESS,
  ActionTypes.LAUNCH_PROJECT_FAILURE)
  <string, undefined, Error>();
export const setMarketData = createStandardAction(ActionTypes.SET_MARKET_DATA)<{ projectId: string, marketData: MarketDataLegacy }>();
export const supportProject = createAsyncAction(
  ActionTypes.SUPPORT_PROJECT_REQUEST,
  ActionTypes.SUPPORT_PROJECT_SUCCESS,
  ActionTypes.SUPPORT_PROJECT_FAILURE)
  <{ projectId: string, contribution: number }, string, Error>();
export const withdrawHoldings = createAsyncAction(
  ActionTypes.WITHDRAW_HOLDINGS_REQUEST,
  ActionTypes.WITHDRAW_HOLDINGS_SUCCESS,
  ActionTypes.WITHDRAW_HOLDINGS_FAILURE)
  <{ projectId: string, tokenAmount: number }, string, Error>();
export const withdrawFunding = createAsyncAction(
  ActionTypes.WITHDRAW_FUNDING_REQUEST,
  ActionTypes.WITHDRAW_FUNDING_SUCCESS,
  ActionTypes.WITHDRAW_FUNDING_FAILURE)
  <string, string, Error>();
export const addResearchUpdate = createAsyncAction(
  ActionTypes.ADD_RESEARCH_UPDATE_REQUEST,
  ActionTypes.ADD_RESEARCH_UPDATE_SUCCESS,
  ActionTypes.ADD_RESEARCH_UPDATE_FAILURE)
  <{projectId: string, update: string}, undefined, Error>();
