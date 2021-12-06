import produce from 'immer';
import {
  CREATE_ROOM_CATEGORY, CREATE_ROOM_CATEGORY_FAILED, CREATE_ROOM_CATEGORY_SUCCESS,
  DELETE_ROOM_CATEGORY,
  DELETE_ROOM_CATEGORY_FAILED,
  DELETE_ROOM_CATEGORY_SUCCESS,
  GET_ALL_ROOM_CATEGORY,
  GET_ALL_ROOM_CATEGORY_FAILED,
  GET_ALL_ROOM_CATEGORY_SUCCESS,
  MODIFY_ROOM_CATEGORY, MODIFY_ROOM_CATEGORY_FAILED,
  MODIFY_ROOM_CATEGORY_SUCCESS,
  RESET_ALL,
} from '@/src/redux/room_category/constants';

const initialState = {
  listRoomCategory: [],
  isLoading: false,
  loading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const roomCategoryReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RESET_ALL:
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.loading = false;
        draft.isError = false;
        break;
      case GET_ALL_ROOM_CATEGORY:
        draft.isLoading = true;
        break;
      case GET_ALL_ROOM_CATEGORY_SUCCESS:
        draft.listRoomCategory = action.data;
        draft.isLoading = false;
        draft.isError = false;
        break;
      case GET_ALL_ROOM_CATEGORY_FAILED:
        draft.listRoomCategory = [];
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
      case DELETE_ROOM_CATEGORY:
        draft.loading = true;
        break;
      case DELETE_ROOM_CATEGORY_SUCCESS:
        draft.isSuccess = true;
        draft.loading = false;
        draft.isError = false;
        break;
      case DELETE_ROOM_CATEGORY_FAILED:
        draft.loading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
        break;
      case MODIFY_ROOM_CATEGORY:
        draft.loading = true;
        break;
      case MODIFY_ROOM_CATEGORY_SUCCESS:
        draft.isSuccess = true;
        draft.loading = false;
        draft.isError = false;
        break;
      case MODIFY_ROOM_CATEGORY_FAILED:
        draft.loading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
        break;
      case CREATE_ROOM_CATEGORY:
        draft.loading = true;
        break;
      case CREATE_ROOM_CATEGORY_SUCCESS:
        draft.isSuccess = true;
        draft.loading = false;
        draft.isError = false;
        break;
      case CREATE_ROOM_CATEGORY_FAILED:
        draft.loading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
        break;
    }
  });

export default roomCategoryReducer;
