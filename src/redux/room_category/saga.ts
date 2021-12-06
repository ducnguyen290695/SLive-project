import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import {
  CREATE_ROOM_CATEGORY,
  DELETE_ROOM_CATEGORY,
  GET_ALL_ROOM_CATEGORY,
  MODIFY_ROOM_CATEGORY,
} from '@/src/redux/room_category/constants';
import { ROOMS_CATEGORY_URL } from '@/src/utils/urlConfig';
import api from '@/src/utils/api';
import { serialize } from '@/src/utils/common';
import {
  createRoomCategoryFailed,
  createRoomCategorySuccess,
  deleteRoomCategoryFailed,
  deleteRoomCategorySuccess,
  getAllRoomCategoryFailed,
  getAllRoomCategorySuccess, modifyRoomCategoryFailed, modifyRoomCategorySuccess,
} from '@/src/redux/room_category/actions';

function* getAllRoomCategory(action: any) {
  try {
    const param = serialize(action.body);
    const url = `${ROOMS_CATEGORY_URL}?${param}`;
    const response = yield call(() => api.get({ url }));
    if (response?.data) {
      yield put(getAllRoomCategorySuccess(response?.data?.data || []));
    }
  } catch (e) {
    yield put(getAllRoomCategoryFailed(e));
  }
}

function* deleteRoomCategory(action: any) {
  try {
    const url = `${ROOMS_CATEGORY_URL}/${action?.body}`;
    const response = yield call(() => api.delete({ url: url }));
    if (response?.data) {
      yield put(deleteRoomCategorySuccess({}));
    }
  } catch (e) {
    yield put(deleteRoomCategoryFailed(e));
  }
}

function* createRoomCategory(action: any) {
  try {
    const url = `${ROOMS_CATEGORY_URL}`;
    const response = yield call(() => api.post({ url: url, payload: action?.body }));
    if (response?.data) {
      yield put(createRoomCategorySuccess({}));
    }
  } catch (e) {
    yield put(createRoomCategoryFailed(e));
  }
}


function* modifyRoomCategory(action: any) {
  try {
    const url = `${ROOMS_CATEGORY_URL}/${action?.body?.id}`;
    const response = yield call(() => api.put({ url: url, payload: action?.body }));
    if (response?.data) {
      yield put(modifyRoomCategorySuccess({}));
    }
  } catch (e) {
    yield put(modifyRoomCategoryFailed(e));
  }
}

const roomCategorySaga = [
  takeEvery(GET_ALL_ROOM_CATEGORY, getAllRoomCategory),
  takeLatest(MODIFY_ROOM_CATEGORY, modifyRoomCategory),
  takeLatest(DELETE_ROOM_CATEGORY, deleteRoomCategory),
  takeLatest(CREATE_ROOM_CATEGORY, createRoomCategory),
];

export default roomCategorySaga;
