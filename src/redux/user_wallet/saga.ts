import { call, put, takeEvery } from 'redux-saga/effects';
import { WALLET_URL } from '@/src/utils/urlConfig';
import api from '@/src/utils/api';
import { GET_ALL_USER_WALLETS } from '@/src/redux/user_wallet/constants';
import { getAllUserWalletFailed, getAllUserWalletSuccess } from '@/src/redux/user_wallet/actions';
import { serialize } from '@/src/utils/common';

function* getAllUserWallet(action: any) {
  try {
    const param = serialize(action.body);
    const url = `${WALLET_URL}?${param}`;
    const response = yield call(() => api.get({ url }));
    if (response?.data) {
      yield put(getAllUserWalletSuccess(response?.data?.data || []));
    }
  } catch (e) {
    yield put(getAllUserWalletFailed(e));
  }
}

const userWalletSaga = [takeEvery(GET_ALL_USER_WALLETS, getAllUserWallet)];

export default userWalletSaga;
