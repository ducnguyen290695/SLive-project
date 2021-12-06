import { call, put, takeEvery } from 'redux-saga/effects';
import actions from './actions';
import { fetchUsersRest, updateUserRest, deleteUserRest } from './services';

function* fetchUsers(action) {
  try {
    const response = yield call(fetchUsersRest, action.payload);
    yield put({
      type: actions.FETCH.FETCH_USERS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({ type: actions.FETCH.FETCH_USERS_FAILURE, error });
  }
}

function* updateUser(action) {
  try {
    yield call(updateUserRest, action.payload);
    yield put({
      type: actions.UPDATE.UPDATE_USER_SUCCESS,
    });
  } catch (error) {
    yield put({ type: actions.UPDATE.UPDATE_USER_FAILURE, error });
  }
}

function* deleteUser(action) {
  try {
    yield call(deleteUserRest, action.payload);
    yield put({
      type: actions.DELETE.DELETE_USER_SUCCESS,
    });
  } catch (error) {
    yield put({ type: actions.DELETE.DELETE_USER_FAILURE, error });
  }
}

function* searchUser(action) {
  try {
    yield call(deleteUserRest, action.payload);
    yield put({
      type: actions.SEARCH.SEARCH_USER_SUCCESS,
    });
  } catch (error) {
    yield put({ type: actions.SEARCH.SEARCH_USER_FAILURE, error });
  }
}

const userSaga = [
  takeEvery(actions.FETCH.FETCH_USERS_REQUEST, fetchUsers),
  takeEvery(actions.UPDATE.UPDATE_USER_REQUEST, updateUser),
  takeEvery(actions.DELETE.DELETE_USER_REQUEST, deleteUser),
  takeEvery(actions.SEARCH.SEARCH_USER_REQUEST, searchUser),
];

export default userSaga;
