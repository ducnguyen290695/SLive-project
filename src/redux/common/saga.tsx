import { generateActions, generateSaga } from '@/src/utils/redux/generator';
import { takeEvery } from 'redux-saga/effects';
import { fetchAddressRest } from './services';

const [FETCH] = generateActions('address');

const [fetchAddress] = generateSaga({
  modelName: 'address',
  fetchApi: fetchAddressRest,
  createApi: null,
  updateApi: null,
  deleteApi: null,
});

const commonSaga = [takeEvery(FETCH.FETCH_REQUEST, fetchAddress)];

export default commonSaga;
