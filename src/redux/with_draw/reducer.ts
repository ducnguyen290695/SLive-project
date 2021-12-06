import produce from 'immer';
import {
  CHANGE_STATUS, CHANGE_STATUS_FAILED, CHANGE_STATUS_SUCCESS,
  GET_ALL_WITH_DRAW, GET_ALL_WITH_DRAW_FAILED, GET_ALL_WITH_DRAW_SUCCESS,
  RESET_ALL,
} from '@/src/redux/with_draw/constants';

const initialState = {
  listWithDraw: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  loading: false,
  error: null,
};

const withDrawReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RESET_ALL:
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = false;
        break;
      case GET_ALL_WITH_DRAW:
        draft.isLoading = true;
        break;
      case GET_ALL_WITH_DRAW_SUCCESS:
        draft.listWithDraw = action.data;
        draft.isLoading = false;
        draft.isError = false;
        break;
      case GET_ALL_WITH_DRAW_FAILED:
        draft.listWithDraw = [];
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
      case CHANGE_STATUS:
        draft.loading = true;
        break;
      case CHANGE_STATUS_SUCCESS:
        draft.isSuccess = true;
        draft.loading = false;
        draft.isError = false;
        break;
      case CHANGE_STATUS_FAILED:
        draft.loading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
        break;
    }
  });

export default withDrawReducer;
