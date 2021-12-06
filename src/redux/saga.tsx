import { all } from 'redux-saga/effects';
import facebookSaga from './auth/FaceBook/saga';
import googleSaga from './auth/Google/saga';
import loginSaga from './auth/LoginWithPass/saga';
import roomsSaga from './rooms/saga';
import giftListSaga from './gifts/saga';
import idolSaga from './idol/saga';
import bannersSaga from './banners/saga';
import userSaga from '../redux/users/saga';
import transactionsSaga from '../redux/transactions/saga';
import userBannedSaga from '../redux/user-banned/saga';
import roomCategorySaga from '../redux/room_category/saga';
import hotIdolSaga from '../redux/hot_idol/saga';
import userWalletSaga from './user_wallet/saga';
import rankSaga from './rank/saga';
import withDrawSaga from './with_draw/saga';
import currentUserSaga from './current_user/saga';
import commonSaga from './common/saga';
import roleSaga from './permission/saga';

const authSaga = [...facebookSaga, ...googleSaga, ...loginSaga];

function* rootSaga() {
  yield all([
    ...authSaga,
    ...userSaga,
    ...roomsSaga,
    ...giftListSaga,
    ...bannersSaga,
    ...transactionsSaga,
    ...userBannedSaga,
    ...idolSaga,
    ...roomCategorySaga,
    ...hotIdolSaga,
    ...userWalletSaga,
    ...rankSaga,
    ...withDrawSaga,
    ...currentUserSaga,
    ...commonSaga,
    ...roleSaga,
  ]);
}

export default rootSaga;
