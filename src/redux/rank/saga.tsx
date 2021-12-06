import { generateActions, generateSaga } from '@/src/utils/redux/generator';
import { takeEvery } from 'redux-saga/effects';
import { fetchRankRest } from './services';

const [FETCH] = generateActions('rank');

const [fetch] = generateSaga({
  modelName: 'rank',
  fetchApi: fetchRankRest,
  createApi: null,
  updateApi: null,
  deleteApi: null,
});

const rankSaga = [takeEvery(FETCH.FETCH_REQUEST, fetch)];

export default rankSaga;
