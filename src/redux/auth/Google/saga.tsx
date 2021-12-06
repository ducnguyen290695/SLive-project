import { put, takeEvery, call, delay } from 'redux-saga/effects';
import Router from 'next/router';
import actions from './actions';
import Cookies from 'js-cookie';

import { ACCESS_TOKEN, API_URL, USER_ID } from '@/src/config/constants';
import api from '@/src/utils/api';
import { getExp } from '@/src/utils/sharedUtils';
import { checkRoles } from '@/src/utils/sharedUtils';
import { ROLES } from '@/src/config/constants';
import { USER_ROLE_URL } from '@/src/utils/urlConfig';

export const loginGoogleRest = googleIdToken => {
  return api.post({
    url: API_URL.GOOGLE_API_URL,
    payload: {
      id_token: googleIdToken,
    },
  });
};

function* loginGoogle(action) {
  try {
    const response = yield call(loginGoogleRest, action.payload);
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
    yield put({
      type: actions.GOOGLE_LOGIN_SUCCESS,
      data: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GOOGLE_LOGIN_FAILURE, error });
  }
}

const googleSaga = [takeEvery(actions.GOOGLE_LOGIN_REQUEST, loginGoogle)];

export default googleSaga;
