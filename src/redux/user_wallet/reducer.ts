import produce from 'immer';
import {
  GET_ALL_USER_WALLETS,
  GET_ALL_USER_WALLETS_FAILED,
  GET_ALL_USER_WALLETS_SUCCESS,
  RESET_ALL,
} from '@/src/redux/user_wallet/constants';

const initialState = {
  listUserWallet: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const userWalletReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RESET_ALL:
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = false;
        break;
      case GET_ALL_USER_WALLETS:
        draft.isLoading = true;
        break;
      case GET_ALL_USER_WALLETS_SUCCESS:
        draft.listUserWallet = action.data;
        draft.isLoading = false;
        draft.isError = false;
        break;
      case GET_ALL_USER_WALLETS_FAILED:
        draft.listUserWallet = [];
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
    }
  });

export default userWalletReducer;
