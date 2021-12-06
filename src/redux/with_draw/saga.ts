import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { UPDATE_WITH_DRAW_REQUEST, WITH_DRAW_URL } from '@/src/utils/urlConfig';
import api from '@/src/utils/api';
import { serialize } from '@/src/utils/common';
import { CHANGE_STATUS, GET_ALL_WITH_DRAW } from '@/src/redux/with_draw/constants';
import {
  changeStatusFailed,
  changeStatusSuccess,
  getAllWithDrawFailed,
  getAllWithDrawSuccess,
} from '@/src/redux/with_draw/actions';

function* getAllWithDrawSaga(action: any) {
  try {
    const param = serialize(action.body);
    const url = `${WITH_DRAW_URL}?${param}`;
    const response = yield call(() => api.get({ url }));
    if (response?.data) {
      yield put(getAllWithDrawSuccess(response?.data?.data || []));
    }
  } catch (e) {
    yield put(getAllWithDrawFailed(e));
  }
}

function* updateStatusSaga(action: any) {
  try {
    const url = `${UPDATE_WITH_DRAW_REQUEST}`;
    const response = yield call(() => api.post({ url: url, payload: action?.body }));
    if (response?.data) {
      yield put(changeStatusSuccess({}));
    }
  } catch (e) {
    yield put(changeStatusFailed(e));
  }
}

const withDrawSaga = [
  takeEvery(GET_ALL_WITH_DRAW, getAllWithDrawSaga),
  takeLatest(CHANGE_STATUS, updateStatusSaga),
];

export default withDrawSaga;
