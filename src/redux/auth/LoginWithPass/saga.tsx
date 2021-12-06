import { call, put, takeEvery, delay } from 'redux-saga/effects';
import Router from 'next/router';
import Cookies from 'js-cookie';
import api from '@/src/utils/api';
import { API_URL, ACCESS_TOKEN, USER_ID } from '@/src/config/constants';
import actions from './actions';
import { getExp } from '@/src/utils/sharedUtils';
import { USER_ROLE_URL } from '@/src/utils/urlConfig';
import { checkRoles } from '@/src/utils/sharedUtils';
import { ROLES } from '@/src/config/constants';

export const loginRest = payload => {
  return api.post({
    url: API_URL.LOGIN_URL,
    payload: {
      ...payload,
    },
  });
};

function* login(action) {
  try {
    const response = yield call(loginRest, action.payload);
    if (response?.data.status) {
      yield put({
        type: actions.LOGIN_SUCCESS,
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
    } else {
      yield put({ type: actions.LOGIN_FAILURE, error: response?.data.message });
    }
  } catch (e) {
    yield put({ type: actions.LOGIN_FAILURE, error: e.response?.data.message });
  }
}

function* getUserRole(action) {
  try {
    const response = yield call(() => api.get({ url: `${USER_ROLE_URL}/${action.payload}` }));
    yield put({
      type: actions.GET_USER_ROLE_SUCCESS,
      data: response.data.data,
    });
  } catch (e) {}
}

const loginSaga = [
  takeEvery(actions.LOGIN_REQUEST, login),
  takeEvery(actions.GET_USER_ROLE, getUserRole),
];

export default loginSaga;
