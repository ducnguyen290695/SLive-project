/**
 * @description all action of room page
 */
import {
  DELETE_ROOM,
  DELETE_ROOM_FAILED,
  DELETE_ROOM_SUCCESS,
  GET_ALL_ROOM_CATEGORY,
  GET_ALL_ROOM_CATEGORY_FAILED,
  GET_ALL_ROOM_CATEGORY_SUCCESS,
  GET_ALL_ROOMS,
  GET_ALL_ROOMS_FAILED,
  GET_ALL_ROOMS_SUCCESS,
  MODIFY_ROOM,
  MODIFY_ROOM_FAILED,
  MODIFY_ROOM_SUCCESS,
  RESET_ALL,
} from '@/src/redux/rooms/constant';

export function resetAct() {
  return {
    type: RESET_ALL,
  };
}

export function getAllRoomsAct(body) {
  return {
    type: GET_ALL_ROOMS,
    body,
  };
}

export function getAllRoomsSuccess(data) {
  return {
    type: GET_ALL_ROOMS_SUCCESS,
    data,
  };
}

export function getAllRoomsFailed(error) {
  return {
    type: GET_ALL_ROOMS_FAILED,
    error,
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


export function deleteRoomAct(body) {
  return {
    type: DELETE_ROOM,
    body,
  };
}

export function deleteRoomSuccess(data) {
  return {
    type: DELETE_ROOM_SUCCESS,
    data,
  };
}

export function deleteRoomFailed(error) {
  return {
    type: DELETE_ROOM_FAILED,
    error,
  };
}

export function modifyRoomAct(body) {
  return {
    type: MODIFY_ROOM,
    body,
  };
}

export function modifyRoomSuccess(data) {
  return {
    type: MODIFY_ROOM_SUCCESS,
    data,
  };
}

export function modifyRoomFailed(error) {
  return {
    type: MODIFY_ROOM_FAILED,
    error,
  };
}

