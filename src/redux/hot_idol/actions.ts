/**
 * @description all action of hot idol page
 */
import {
  CREATE_HOT_IDOL, CREATE_HOT_IDOL_FAILED, CREATE_HOT_IDOL_SUCCESS,
  GET_ALL_HOT_IDOL,
  GET_ALL_HOT_IDOL_FAILED,
  GET_ALL_HOT_IDOL_SUCCESS,
  RESET_ALL,
} from '@/src/redux/hot_idol/constants';

export function resetAct() {
  return {
    type: RESET_ALL,
  };
}

export function getAllHotIdolAct(body) {
  return {
    type: GET_ALL_HOT_IDOL,
    body,
  };
}

export function getAllHotIdolSuccess(data) {
  return {
    type: GET_ALL_HOT_IDOL_SUCCESS,
    data,
  };
}

export function getAllHotIdolFailed(error) {
  return {
    type: GET_ALL_HOT_IDOL_FAILED,
    error,
  };
}

export function createHotIdolAct(body) {
  return {
    type: CREATE_HOT_IDOL,
    body,
  };
}

export function createHotIdolSuccess(data) {
  return {
    type: CREATE_HOT_IDOL_SUCCESS,
    data,
  };
}

export function createHotIdolFailed(error) {
  return {
    type: CREATE_HOT_IDOL_FAILED,
    error,
  };
}
