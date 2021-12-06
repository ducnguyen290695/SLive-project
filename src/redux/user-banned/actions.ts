/**
 * @description all action of user-banned page
 */
import {
  GET_ALL_USER_BANNED, GET_ALL_USER_BANNED_FAILED, GET_ALL_USER_BANNED_SUCCESS,
  RESET_ALL,
} from '@/src/redux/user-banned/constants';

export function resetAct() {
  return {
    type: RESET_ALL,
  };
}

export function getAllUserBannedAct(body) {
  return {
    type: GET_ALL_USER_BANNED,
    body,
  };
}

export function getAllUserBannedSuccess(data) {
  return {
    type: GET_ALL_USER_BANNED_SUCCESS,
    data,
  };
}

export function getAllUserBannedFailed(error) {
  return {
    type: GET_ALL_USER_BANNED_FAILED,
    error,
  };
}
