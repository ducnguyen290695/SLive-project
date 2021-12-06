import api from '@/src/utils/api';
import { API_URL } from '@/src/config/constants';

export const fetchRoleRest = params => {
  return api.get({
    url: `${API_URL.ROLE_API_URL}`,
    params,
  });
};

export const deleteRoleRest = payload => {
  return api.post({
    url: `${API_URL.ROLE_API_URL}/remove`,
    payload,
  });
};

export const createRoleRest = payload => {
  return api.post({
    url: `${API_URL.ROLE_API_URL}`,
    payload: payload,
  });
};
