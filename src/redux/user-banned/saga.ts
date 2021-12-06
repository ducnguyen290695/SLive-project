import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { USER_BANNED_URL } from '@/src/utils/urlConfig';
import api from '@/src/utils/api';
import { GET_ALL_USER_BANNED } from '@/src/redux/user-banned/constants';
import {
  getAllUserBannedFailed, getAllUserBannedSuccess,
} from '@/src/redux/user-banned/actions';

function* getAllUserBanned(action: any) {
  try {
    const newParams = {
      ...action.body
    };
    const url = `${USER_BANNED_URL}`;
    const response = yield call(() => api.get({ url, params: newParams }));
    if (response?.data) {
      yield put(getAllUserBannedSuccess(response?.data?.data || []));
    }
  } catch (e) {
    yield put(getAllUserBannedFailed(e));
  }
}

const userBannedSaga = [takeEvery(GET_ALL_USER_BANNED, getAllUserBanned)];

export default userBannedSaga;
