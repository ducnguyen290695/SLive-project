import produce from 'immer';
import {
  DELETE_ROOM, DELETE_ROOM_FAILED, DELETE_ROOM_SUCCESS, GET_ALL_ROOM_CATEGORY_FAILED, GET_ALL_ROOM_CATEGORY_SUCCESS,
  GET_ALL_ROOMS,
  GET_ALL_ROOMS_FAILED,
  GET_ALL_ROOMS_SUCCESS, MODIFY_ROOM, MODIFY_ROOM_FAILED, MODIFY_ROOM_SUCCESS,
  RESET_ALL,
} from '@/src/redux/rooms/constant';

const initialState = {
  listRooms: [],
  listRoomCategory: [],
  isLoading: false,
  loading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const roomsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RESET_ALL:
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.loading = false;
        draft.isError = false;
        break;
      case GET_ALL_ROOMS:
        draft.isLoading = true;
        break;
      case GET_ALL_ROOMS_SUCCESS:
        draft.listRooms = action.data;
        draft.isLoading = false;
        draft.isError = false;
        break;
      case GET_ALL_ROOMS_FAILED:
        draft.listRooms = [];
        draft.isLoading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
      case GET_ALL_ROOM_CATEGORY_SUCCESS:
        draft.listRoomCategory = action.data;
        break;
      case GET_ALL_ROOM_CATEGORY_FAILED:
        draft.listRoomCategory = [];
      case DELETE_ROOM:
        draft.loading = true;
        break;
      case DELETE_ROOM_SUCCESS:
        draft.isSuccess = true;
        draft.loading = false;
        draft.isError = false;
        break;
      case DELETE_ROOM_FAILED:
        draft.loading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
        break;
      case MODIFY_ROOM:
        draft.loading = true;
        break;
      case MODIFY_ROOM_SUCCESS:
        draft.isSuccess = true;
        draft.loading = false;
        draft.isError = false;
        break;
      case MODIFY_ROOM_FAILED:
        draft.loading = false;
        draft.isSuccess = false;
        draft.isError = true;
        draft.error = action.error;
        break;
    }
  });

export default roomsReducer;
