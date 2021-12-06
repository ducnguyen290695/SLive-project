import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { BANNERS_URL } from '@/src/utils/urlConfig';
import api from '@/src/utils/api';
import { serialize } from '@/src/utils/common';
import {
  createBannerFailed,
  createBannerSuccess,
  deleteBannerFailed,
  deleteBannerSuccess,
  getAllBannersFailed,
  getAllBannersSuccess,
  modifyBannerFailed,
  modifyBannerSuccess,
} from '@/src/redux/banners/actions';
import {
  CREATE_BANNER,
  DELETE_BANNER,
  GET_ALL_BANNERS,
  MODIFY_BANNER,
} from '@/src/redux/banners/constant';

function* getAllBanners(action: any) {
  try {
    const newParams = serialize({
      skip: action?.body?.skip,
      limit: action?.body?.limit,
      ...action?.body?.search,
    });
    const url = `${BANNERS_URL}?${newParams}`;
    const response = yield call(() => api.get({ url }));
    if (response?.data) {
      yield put(getAllBannersSuccess(response?.data?.data || []));
    }
  } catch (e) {
    yield put(getAllBannersFailed(e));
  }
}

function* deleteBanner(action: any) {
  try {
    const url = `${BANNERS_URL}/${action?.body}`;
    const response = yield call(() => api.delete({ url: url }));
    if (response?.data) {
      yield put(deleteBannerSuccess({}));
    }
  } catch (e) {
    yield put(deleteBannerFailed(e));
  }
}

function* modifyBanner(action: any) {
  try {
    const url = `${BANNERS_URL}/${action?.body?.id}`;
    const response = yield call(() =>
      api.patch({
        url: url,
        payload: action?.body?.formData,
        header: { 'content-type': 'multipart/form-data' },
      }),
    );
    if (response?.data) {
      yield put(modifyBannerSuccess({}));
    }
  } catch (e) {
    yield put(modifyBannerFailed(e));
  }
}

function* createBanner(action: any) {
  try {
    const url = `${BANNERS_URL}`;
    const response = yield call(() => api.postUpload({ url, payload: action?.body }));
    if (response?.data) {
      yield put(createBannerSuccess({}));
    }
  } catch (e) {
    yield put(createBannerFailed(e));
  }
}

const bannersSaga = [
  takeEvery(GET_ALL_BANNERS, getAllBanners),
  takeLatest(MODIFY_BANNER, modifyBanner),
  takeLatest(DELETE_BANNER, deleteBanner),
  takeLatest(CREATE_BANNER, createBanner),
];

export default bannersSaga;
