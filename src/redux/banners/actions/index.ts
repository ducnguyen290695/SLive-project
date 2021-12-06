/**
 * @description all action of banners page
 */
import {
  RESET_ALL,
  CREATE_BANNER,
  CREATE_BANNER_FAILED,
  CREATE_BANNER_SUCCESS,
  DELETE_BANNER,
  DELETE_BANNER_FAILED,
  DELETE_BANNER_SUCCESS,
  GET_ALL_BANNERS,
  GET_ALL_BANNERS_FAILED,
  GET_ALL_BANNERS_SUCCESS,
  MODIFY_BANNER,
  MODIFY_BANNER_FAILED,
  MODIFY_BANNER_SUCCESS,
} from '@/src/redux/banners/constant';

export function resetAct() {
  return {
    type: RESET_ALL,
  };
}

export function getAllBannersAct(body) {
  return {
    type: GET_ALL_BANNERS,
    body,
  };
}

export function getAllBannersSuccess(data) {
  return {
    type: GET_ALL_BANNERS_SUCCESS,
    data,
  };
}

export function getAllBannersFailed(error) {
  return {
    type: GET_ALL_BANNERS_FAILED,
    error,
  };
}

export function deleteBannerAct(body) {
  return {
    type: DELETE_BANNER,
    body,
  };
}

export function deleteBannerSuccess(data) {
  return {
    type: DELETE_BANNER_SUCCESS,
    data,
  };
}

export function deleteBannerFailed(error) {
  return {
    type: DELETE_BANNER_FAILED,
    error,
  };
}

export function modifyBannerAct(body) {
  return {
    type: MODIFY_BANNER,
    body,
  };
}

export function modifyBannerSuccess(data) {
  return {
    type: MODIFY_BANNER_SUCCESS,
    data,
  };
}

export function modifyBannerFailed(error) {
  return {
    type: MODIFY_BANNER_FAILED,
    error,
  };
}

export function createBannerAct(body) {
  return {
    type: CREATE_BANNER,
    body,
  };
}

export function createBannerSuccess(data) {
  return {
    type: CREATE_BANNER_SUCCESS,
    data,
  };
}

export function createBannerFailed(error) {
  return {
    type: CREATE_BANNER_FAILED,
    error,
  };
}
