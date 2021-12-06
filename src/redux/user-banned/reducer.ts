import produce from 'immer';
import {
  GET_ALL_USER_BANNED, GET_ALL_USER_BANNED_FAILED, GET_ALL_USER_BANNED_SUCCESS,
  RESET_ALL,
} from '@/src/redux/user-banned/constants';

const initialState = {
  listUserBanned: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const userBannedReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RESET_ALL:
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = false;
        break;
      case GET_ALL_USER_BANNED:
        draft.isLoading = true;
        break;
      case GET_ALL_USER_BANNED_SUCCESS:
        draft.listUserBanned = action.data;
        draft.isLoading = false;
        draft.isError = false;
        break;
      case GET_ALL_USER_BANNED_FAILED:
        draft.listUserBanned = [];
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
    }
  });

export default userBannedReducer;
