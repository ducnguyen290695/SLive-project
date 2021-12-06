import { combineReducers } from 'redux';
import { generateReducer } from '@/src/utils/redux/generator';

const [fetchCurrentUser, , updateCurrentUser] = generateReducer('current_user');
const [, , updateAvatar] = generateReducer('avatar');
const [, , updateCover] = generateReducer('cover');

const currentUserReducer = combineReducers({
  fetchCurrentUser,
  updateCurrentUser,
  updateAvatar,
  updateCover,
});

export default currentUserReducer;
