import api from '@/src/utils/api';
import { API_URL } from '@/src/config/constants';

export const fetchCurrentUserRest = () => {
  return api.get({
    url: `${API_URL.CURRENT_USER_API_URL}`,
  });
};

export const updateCurrentUserRest = data => {
  return api.post({
    url: `${API_URL.UPDATE_CURRENT_USER_API_URL}`,
    payload: data,
  });
};

export const updateAvatarRest = data => {
  return api.postUpload({
    url: `${API_URL.UPLOAD_AVATAR_API_URL}`,
    payload: data,
  });
};

export const updateCoverRest = data => {
  return api.postUpload({
    url: `${API_URL.UPLOAD_COVER_API_URL}`,
    payload: data,
  });
};
