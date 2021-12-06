import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { DELETE_ROOM, GET_ALL_ROOM_CATEGORY, GET_ALL_ROOMS, MODIFY_ROOM } from '@/src/redux/rooms/constant';
import {
  deleteRoomFailed,
  deleteRoomSuccess,
  getAllRoomsFailed,
  getAllRoomsSuccess,
  modifyRoomFailed,
  modifyRoomSuccess,
  getAllRoomCategorySuccess,
  getAllRoomCategoryFailed,
} from '@/src/redux/rooms/actions';
import { ROOMS_CATEGORY_URL, ROOMS_URL } from '@/src/utils/urlConfig';
import api from '@/src/utils/api';
import { serialize } from '@/src/utils/common';

function* getAllRooms(action: any) {
  try {
    const newParams = serialize({
      skip: action?.body?.skip,
      limit: action?.body?.limit,
      ...action?.body?.search,
    });
    const url = `${ROOMS_URL}?${newParams}`;
    const response = yield call(() => api.get({ url }));
    if (response?.data) {
      yield put(getAllRoomsSuccess(response?.data?.data || []));
    }
  } catch (e) {
    yield put(getAllRoomsFailed(e));
  }
}

function* getAllRoomCategory(action: any) {
  try {
    const url = `${ROOMS_CATEGORY_URL}?skip0&limit=1000`;
    const response = yield call(() => api.get({ url }));
    if (response?.data) {
      yield put(getAllRoomCategorySuccess(response?.data?.data || []));
    }
  } catch (e) {
    yield put(getAllRoomCategoryFailed(e));
  }
}


function* deleteRoom(action: any) {
  try {
    const url = `${ROOMS_URL}/${action?.body}`;
    const response = yield call(() => api.delete({ url: url }));
    if (response?.data) {
      yield put(deleteRoomSuccess({}));
    }
  } catch (e) {
    yield put(deleteRoomFailed(e));
  }
}

function* modifyRoom(action: any) {
  try {
    const url = `${ROOMS_URL}/${action?.body?.id}`;
    const response = yield call(() => api.patch({ url: url, payload: action?.body }));
    if (response?.data) {
      yield put(modifyRoomSuccess({}));
    }
  } catch (e) {
    yield put(modifyRoomFailed(e));
  }
}

const roomsSaga = [
  takeEvery(GET_ALL_ROOMS, getAllRooms),
  takeLatest(MODIFY_ROOM, modifyRoom),
  takeLatest(DELETE_ROOM, deleteRoom),
  takeLatest(GET_ALL_ROOM_CATEGORY, getAllRoomCategory),
];

export default roomsSaga;
