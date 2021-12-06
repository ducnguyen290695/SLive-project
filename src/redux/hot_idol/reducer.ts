import produce from 'immer';
import {
  CREATE_HOT_IDOL, CREATE_HOT_IDOL_FAILED, CREATE_HOT_IDOL_SUCCESS,
  GET_ALL_HOT_IDOL,
  GET_ALL_HOT_IDOL_FAILED,
  GET_ALL_HOT_IDOL_SUCCESS,
  RESET_ALL,
} from '@/src/redux/hot_idol/constants';

const initialState = {
  listHotIdol: [],
  isLoading: false,
  loading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const hotIdolReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RESET_ALL:
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.loading = false;
        draft.isError = false;
        break;
      case GET_ALL_HOT_IDOL:
        draft.isLoading = true;
        break;
      case GET_ALL_HOT_IDOL_SUCCESS:
        draft.listHotIdol = action.data;
        draft.isLoading = false;
        draft.isError = false;
        break;
      case GET_ALL_HOT_IDOL_FAILED:
        draft.listHotIdol = [];
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
      case CREATE_HOT_IDOL:
        draft.loading = true;
        break;
      case CREATE_HOT_IDOL_SUCCESS:
        draft.isSuccess = true;
        draft.loading = false;
        draft.isError = false;
        break;
      case CREATE_HOT_IDOL_FAILED:
        draft.loading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
        break;
    }
  });

export default hotIdolReducer;
