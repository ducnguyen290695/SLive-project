import { generateActions, generateSaga } from '@/src/utils/redux/generator';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchIdolRest, updateIdolStatusRest, deleteIdolRest, updateIdolRest } from './services';
import actions from './actions';

const [FETCH, , UPDATE, DELETE] = generateActions('idol');

const [fetch, , update, _delete] = generateSaga({
  modelName: 'idol',
  fetchApi: fetchIdolRest,
  createApi: null,
  updateApi: updateIdolRest,
  deleteApi: deleteIdolRest,
});

function* changeIdolStatus(action) {
  try {
    yield call(updateIdolStatusRest, action.payload);
    yield put({
      type: actions.CHANGE_STATUS.CHANGE_IDOL_STATUS_SUCCESS,
    });
  } catch (error) {
    yield put({ type: actions.CHANGE_STATUS.CHANGE_IDOL_STATUS_FAILURE, error });
  }
}

const idolSaga = [
  takeEvery(FETCH.FETCH_REQUEST, fetch),
  takeEvery(UPDATE.UPDATE_REQUEST, update),
  takeEvery(DELETE.DELETE_REQUEST, _delete),
  takeEvery(actions.CHANGE_STATUS.CHANGE_IDOL_STATUS_REQUEST, changeIdolStatus),
];

export default idolSaga;
