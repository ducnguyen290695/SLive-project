import { generateActions, generateSaga } from '@/src/utils/redux/generator';
import { takeEvery } from 'redux-saga/effects';
import {
  fetchCurrentUserRest,
  updateCurrentUserRest,
  updateAvatarRest,
  updateCoverRest,
} from './services';

const [FETCH, , UPDATE] = generateActions('current_user');
const [, , UPDATE_AVATAR] = generateActions('avatar');
const [, , UPDATE_COVER] = generateActions('cover');

const [fetch, , update] = generateSaga({
  modelName: 'current_user',
  fetchApi: fetchCurrentUserRest,
  createApi: null,
  updateApi: updateCurrentUserRest,
  deleteApi: null,
});

const [, , updateAvatar] = generateSaga({
  modelName: 'avatar',
  fetchApi: null,
  createApi: null,
  updateApi: updateAvatarRest,
  deleteApi: null,
});

const [, , updateCover] = generateSaga({
  modelName: 'cover',
  fetchApi: null,
  createApi: null,
  updateApi: updateCoverRest,
  deleteApi: null,
});

const currentUserSaga = [
  takeEvery(FETCH.FETCH_REQUEST, fetch),
  takeEvery(UPDATE.UPDATE_REQUEST, update),
  takeEvery(UPDATE_AVATAR.UPDATE_REQUEST, updateAvatar),
  takeEvery(UPDATE_COVER.UPDATE_REQUEST, updateCover),
];

export default currentUserSaga;
