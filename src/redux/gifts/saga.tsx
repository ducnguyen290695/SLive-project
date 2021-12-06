import { call, put, takeEvery } from 'redux-saga/effects';
import actions from './actions';
import { fetchGiftsRest, updateGiftRest, createGiftRest, deleteGiftRest } from './services';

function* fetchGifts() {
  try {
    const response = yield call(fetchGiftsRest);
    yield put({
      type: actions.FETCH.FETCH_GIFTS_SUCCESS,
      data: response.data,
    });
  } catch (error) {
    yield put({ type: actions.FETCH.FETCH_GIFTS_FAILURE, error });
  }
}

function* updateGift(action) {
  try {
    const response = yield call(updateGiftRest, action.payload);
    yield put({
      type: actions.UPDATE.UPDATE_GIFT_SUCCESS,
      data: response.data,
    });
  } catch (error) {
    yield put({ type: actions.UPDATE.UPDATE_GIFT_FAILURE, error });
  }
}

function* createGift(action) {
  try {
    yield call(createGiftRest, action.payload);
    console.log('create gift');
    yield put({
      type: actions.CREATE.CREATE_GIFT_SUCCESS,
    });
  } catch (error) {
    yield put({ type: actions.CREATE.CREATE_GIFT_FAILURE, error });
  }
}

function* deleteGift(action) {
  try {
    yield call(deleteGiftRest, action.payload);
    yield put({
      type: actions.DELETE.DELETE_GIFT_SUCCESS,
    });
  } catch (error) {
    yield put({ type: actions.DELETE.DELETE_GIFT_FAILURE, error });
  }
}

const giftSaga = [takeEvery(actions.FETCH.FETCH_GIFTS_REQUEST, fetchGifts),takeEvery(actions.UPDATE.UPDATE_GIFT_REQUEST, updateGift), takeEvery(actions.CREATE.CREATE_GIFT_REQUEST, createGift), takeEvery(actions.DELETE.DELETE_GIFT_REQUEST, deleteGift)];
export default giftSaga;
