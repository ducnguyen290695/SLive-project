import api from '@/src/utils/api';
import { API_URL } from '@/src/config/constants';

export const fetchIdolRest = params => {
  return api.get({
    url: `${API_URL.USER_API_URL}`,
    params,
  });
};

export const updateIdolRest = ({ id, data }) => {
  return api.put({
    url: `${API_URL.USER_API_URL}/${id}`,
    payload: data,
  });
};

export const deleteIdolRest = id => {
  return api.delete({
    url: `${API_URL.USER_API_URL}/${id}`,
  });
};

export const updateIdolStatusRest = ({ id, data }) => {
  return api.patch({
    url: `${API_URL.USER_API_URL}/${id}/broadcasters`,
    payload: data,
  });
};
