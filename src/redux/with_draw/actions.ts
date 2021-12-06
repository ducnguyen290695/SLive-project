/**
 * @description all action of with draw page
 */
import {
  CHANGE_STATUS, CHANGE_STATUS_FAILED, CHANGE_STATUS_SUCCESS,
  GET_ALL_WITH_DRAW, GET_ALL_WITH_DRAW_FAILED, GET_ALL_WITH_DRAW_SUCCESS,
  RESET_ALL,
} from '@/src/redux/with_draw/constants';

export function resetAct() {
  return {
    type: RESET_ALL,
  };
}

export function getAllWithDrawAct(body) {
  return {
    type: GET_ALL_WITH_DRAW,
    body,
  };
}

export function getAllWithDrawSuccess(data) {
  return {
    type: GET_ALL_WITH_DRAW_SUCCESS,
    data,
  };
}

export function getAllWithDrawFailed(error) {
  return {
    type: GET_ALL_WITH_DRAW_FAILED,
    error,
  };
}

export function changeStatusAct(body) {
  return {
    type: CHANGE_STATUS,
    body,
  };
}

export function changeStatusSuccess(data) {
  return {
    type: CHANGE_STATUS_SUCCESS,
    data,
  };
}

export function changeStatusFailed(error) {
  return {
    type: CHANGE_STATUS_FAILED,
    error,
  };
}
