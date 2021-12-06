import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { BANNERS_URL, TRANSACTIONS_URL } from '@/src/utils/urlConfig';
import api from '@/src/utils/api';
import { serialize } from '@/src/utils/common';
import { GET_ALL_TRANSACTIONS } from '@/src/redux/transactions/constants';
import {
  getAllTransactionsFailed,
  getAllTransactionsSuccess,
} from '@/src/redux/transactions/actions';

function* getAllTransactions(action: any) {
  try {
    const newParams = serialize({
      skip: action?.body?.skip,
      limit: action?.body?.limit,
      ...action?.body?.search,
    });
    const url = `${TRANSACTIONS_URL}?${newParams}`;
    const response = yield call(() => api.get({ url }));
    if (response?.data) {
      yield put(getAllTransactionsSuccess(response?.data?.data || []));
    }
  } catch (e) {
    yield put(getAllTransactionsFailed(e));
  }
}

const transactionsSaga = [takeEvery(GET_ALL_TRANSACTIONS, getAllTransactions)];

export default transactionsSaga;
