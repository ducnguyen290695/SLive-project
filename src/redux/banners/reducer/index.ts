import produce from 'immer';
import {
  RESET_ALL,
  CREATE_BANNER,
  CREATE_BANNER_FAILED,
  CREATE_BANNER_SUCCESS,
  DELETE_BANNER,
  DELETE_BANNER_FAILED,
  DELETE_BANNER_SUCCESS,
  GET_ALL_BANNERS,
  GET_ALL_BANNERS_FAILED,
  GET_ALL_BANNERS_SUCCESS,
  MODIFY_BANNER,
  MODIFY_BANNER_FAILED,
  MODIFY_BANNER_SUCCESS,
} from '@/src/redux/banners/constant';

const initialState = {
  listBanners: [],
  isLoading: false,
  loading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const bannersReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RESET_ALL:
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.loading = false;
        draft.isError = false;
        break;
      case GET_ALL_BANNERS:
        draft.isLoading = true;
        break;
      case GET_ALL_BANNERS_SUCCESS:
        draft.listBanners = action.data;
        draft.isLoading = false;
        draft.isError = false;
        break;
      case GET_ALL_BANNERS_FAILED:
        draft.listBanners = [];
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
      case DELETE_BANNER:
        draft.loading = true;
        break;
      case DELETE_BANNER_SUCCESS:
        draft.isSuccess = true;
        draft.loading = false;
        draft.isError = false;
        break;
      case DELETE_BANNER_FAILED:
        draft.loading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
        break;
      case MODIFY_BANNER:
        draft.loading = true;
        break;
      case MODIFY_BANNER_SUCCESS:
        draft.isSuccess = true;
        draft.loading = false;
        draft.isError = false;
        break;
      case MODIFY_BANNER_FAILED:
        draft.loading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
        break;
      case CREATE_BANNER:
        draft.loading = true;
        break;
      case CREATE_BANNER_SUCCESS:
        draft.isSuccess = true;
        draft.loading = false;
        draft.isError = false;
        break;
      case CREATE_BANNER_FAILED:
        draft.loading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
        break;
    }
  });

export default bannersReducer;
