import { combineReducers } from 'redux';
import faceBookLogin from './auth/FaceBook/reducer';
import googleLogin from './auth/Google/reducer';
import roomsReducer from './rooms/reducer';
import bannersReducer from './banners/reducer';
import login from '../redux/auth/LoginWithPass/reducer';
import transactionsReducer from './transactions/reducer';
import userBannedReducer from './user-banned/reducer';
import roomCategoryReducer from './room_category/reducer';
import hotIdolReducer from './hot_idol/reducer';
import userWalletReducer from './user_wallet/reducer';
import giftsReducer from './gifts/reducers';
import idolReducer from './idol/reducer';
import userReducer from '../redux/users/reducer';
import rankReducer from './rank/reducer';
import withDrawReducer from './with_draw/reducer';
import currentUserReducer from './current_user/reducer';
import commonReducer from './common/reducer';
import roleReducer from './permission/reducer';

const authReducer = {
  faceBookLogin,
  googleLogin,
  login,
};

const rootReducer = combineReducers({
  ...authReducer,
  roomsReducer,
  giftsReducer,
  userReducer,
  bannersReducer,
  transactionsReducer,
  idolReducer,
  userBannedReducer,
  roomCategoryReducer,
  hotIdolReducer,
  userWalletReducer,
  rankReducer,
  withDrawReducer,
  currentUserReducer,
  commonReducer,
  roleReducer,
});

export default rootReducer;
