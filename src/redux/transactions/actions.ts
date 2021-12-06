/**
 * @description all action of transactions page
 */
import {
  GET_ALL_TRANSACTIONS,
  GET_ALL_TRANSACTIONS_FAILED,
  GET_ALL_TRANSACTIONS_SUCCESS,
  RESET_ALL,
} from '@/src/redux/transactions/constants';

export function resetAct() {
  return {
    type: RESET_ALL,
  };
}

export function getAllTransactionsAct(body) {
  return {
    type: GET_ALL_TRANSACTIONS,
    body,
  };
}

export function getAllTransactionsSuccess(data) {
  return {
    type: GET_ALL_TRANSACTIONS_SUCCESS,
    data,
  };
}

export function getAllTransactionsFailed(error) {
  return {
    type: GET_ALL_TRANSACTIONS_FAILED,
    error,
  };
}
