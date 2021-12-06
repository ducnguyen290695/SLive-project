import produce from 'immer';
import {
  RESET_ALL,
  GET_ALL_TRANSACTIONS,
  GET_ALL_TRANSACTIONS_FAILED,
  GET_ALL_TRANSACTIONS_SUCCESS,
} from '@/src/redux/transactions/constants';

const initialState = {
  listTransactions: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const transactionsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RESET_ALL:
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = false;
        break;
      case GET_ALL_TRANSACTIONS:
        draft.isLoading = true;
        break;
      case GET_ALL_TRANSACTIONS_SUCCESS:
        draft.listTransactions = action.data;
        draft.isLoading = false;
        draft.isError = false;
        break;
      case GET_ALL_TRANSACTIONS_FAILED:
        draft.listTransactions = [];
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
    }
  });

export default transactionsReducer;
