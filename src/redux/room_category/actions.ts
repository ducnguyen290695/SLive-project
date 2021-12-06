/**
 * @description all action of room page
 */
import {
  CREATE_ROOM_CATEGORY, CREATE_ROOM_CATEGORY_FAILED, CREATE_ROOM_CATEGORY_SUCCESS,
  DELETE_ROOM_CATEGORY,
  DELETE_ROOM_CATEGORY_FAILED,
  DELETE_ROOM_CATEGORY_SUCCESS,
  GET_ALL_ROOM_CATEGORY,
  GET_ALL_ROOM_CATEGORY_FAILED,
  GET_ALL_ROOM_CATEGORY_SUCCESS,
  MODIFY_ROOM_CATEGORY, MODIFY_ROOM_CATEGORY_FAILED,
  MODIFY_ROOM_CATEGORY_SUCCESS,
  RESET_ALL,
} from '@/src/redux/room_category/constants';

export function resetAct() {
  return {
    type: RESET_ALL,
  };
}

export function getAllRoomCategoryAct(body) {
  return {
    type: GET_ALL_ROOM_CATEGORY,
    body,
  };
}

export function getAllRoomCategorySuccess(data) {
  return {
    type: GET_ALL_ROOM_CATEGORY_SUCCESS,
    data,
  };
}

export function getAllRoomCategoryFailed(error) {
  return {
    type: GET_ALL_ROOM_CATEGORY_FAILED,
    error,
  };
}

export function createRoomCategoryAct(body) {
  return {
    type: CREATE_ROOM_CATEGORY,
    body,
  };
}

export function createRoomCategorySuccess(data) {
  return {
    type: CREATE_ROOM_CATEGORY_SUCCESS,
    data,
  };
}

export function createRoomCategoryFailed(error) {
  return {
    type: CREATE_ROOM_CATEGORY_FAILED,
    error,
  };
}

export function deleteRoomCategoryAct(body) {
  return {
    type: DELETE_ROOM_CATEGORY,
    body,
  };
}

export function deleteRoomCategorySuccess(data) {
  return {
    type: DELETE_ROOM_CATEGORY_SUCCESS,
    data,
  };
}

export function deleteRoomCategoryFailed(error) {
  return {
    type: DELETE_ROOM_CATEGORY_FAILED,
    error,
  };
}

export function modifyRoomCategoryAct(body) {
  return {
    type: MODIFY_ROOM_CATEGORY,
    body,
  };
}

export function modifyRoomCategorySuccess(data) {
  return {
    type: MODIFY_ROOM_CATEGORY_SUCCESS,
    data,
  };
}

export function modifyRoomCategoryFailed(error) {
  return {
    type: MODIFY_ROOM_CATEGORY_FAILED,
    error,
  };
}

