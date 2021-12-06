import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { HOT_IDOL_URL } from '@/src/utils/urlConfig';
import api from '@/src/utils/api';
import { CREATE_HOT_IDOL, GET_ALL_HOT_IDOL } from '@/src/redux/hot_idol/constants';
import {
  createHotIdolFailed,
  createHotIdolSuccess,
  getAllHotIdolFailed,
  getAllHotIdolSuccess,
} from '@/src/redux/hot_idol/actions';

function* getAllHotIdol(action: any) {
  try {
    const url = `${HOT_IDOL_URL}`;
    const response = yield call(() => api.get({ url, params: action.body }));
    if (response?.data) {
      yield put(getAllHotIdolSuccess(response?.data?.data || []));
    }
  } catch (e) {
    yield put(getAllHotIdolFailed(e));
  }
}

function* createHotIdol(action: any) {
  try {
    const url = `${HOT_IDOL_URL}`;
    const response = yield call(() => api.post({ url: url, payload: action?.body }));
    if (response?.data) {
      yield put(createHotIdolSuccess({}));
    }
  } catch (e) {
    yield put(createHotIdolFailed(e));
  }
}

const hotIdolSaga = [
  takeEvery(GET_ALL_HOT_IDOL, getAllHotIdol),
  takeLatest(CREATE_HOT_IDOL, createHotIdol),
];

export default hotIdolSaga;
