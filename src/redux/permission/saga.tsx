import { generateActions, generateSaga } from '@/src/utils/redux/generator';
import { takeEvery } from 'redux-saga/effects';
import { fetchRoleRest, deleteRoleRest, createRoleRest } from './services';

const [FETCH, CREATE, , DELETE] = generateActions('role');

const [fetch, create, , deleteRole] = generateSaga({
  modelName: 'role',
  fetchApi: fetchRoleRest,
  createApi: createRoleRest,
  updateApi: null,
  deleteApi: deleteRoleRest,
});

const roleSaga = [
  takeEvery(FETCH.FETCH_REQUEST, fetch),
  takeEvery(DELETE.DELETE_REQUEST, deleteRole),
  takeEvery(CREATE.CREATE_REQUEST, create),
];

export default roleSaga;
