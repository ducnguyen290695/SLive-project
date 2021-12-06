import { call, put, takeEvery, delay } from 'redux-saga/effects';
import Router from 'next/router';
import Cookies from 'js-cookie';

import { ACCESS_TOKEN, API_URL, USER_ID } from '@/src/config/constants';
import api from '@/src/utils/api';
import actions from './actions';
import { getExp } from '@/src/utils/sharedUtils';
import { checkRoles } from '@/src/utils/sharedUtils';
import { ROLES } from '@/src/config/constants';
import { USER_ROLE_URL } from '@/src/utils/urlConfig';

export const loginFacebookRest = facebookAccessToken => {
  return api.post({
    url: API_URL.FACEBOOK_API_URL,
    payload: {
      access_token: facebookAccessToken,
    },
  });
};

function* loginFaceBook(action) {
  try {
    const response = yield call(loginFacebookRest, action.payload);
    yield put({
      type: actions.FACEBOOK_LOGIN_SUCCESS,
      data: response.data,
    });
    const exp = getExp(response?.data.data.access_token);
    Cookies.set(ACCESS_TOKEN, response?.data.data.access_token, { expires: exp });
    Cookies.set(USER_ID, response?.data.data.id);

    const roleData = yield call(() =>
      api.get({ url: `${USER_ROLE_URL}/${response?.data.data.id}` }),
    );
    const userRoles = (roleData?.data?.data || []).map(item => item.role);
    if (checkRoles({ userRoles, permittedRoles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] })) {
      yield delay(500);
      Router.push('/users');
    } else {
      Router.push('/blank-page');
    }
  } catch (error) {
    yield put({ type: actions.FACEBOOK_LOGIN_FAILURE, error });
  }
}

const facebookSaga = [takeEvery(actions.FACEBOOK_LOGIN_REQUEST, loginFaceBook)];

export default facebookSaga;
